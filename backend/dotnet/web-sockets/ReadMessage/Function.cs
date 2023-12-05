using Amazon.ApiGatewayManagementApi;
using Amazon.ApiGatewayManagementApi.Model;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Amazon.Runtime;
using Newtonsoft.Json;
using ReadMessage.Extensions;
using ReadMessage.Models;
using ReadMessage.Services;
using System.Net;
using System.Text;
using System.Text.Json.Nodes;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace ReadMessage;

public class Function
{
    private readonly DbProvider _dbProvider;

    public Function()
    {
        _dbProvider = new DbProvider();
    }

    public async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest request, ILambdaContext context)
    {
        try 
        {
            var endpoint = request.GetEndpoint();
            context.Logger.LogInformation($"API gateway managment endpoint: {endpoint}");

            var data = JsonConvert.DeserializeObject<ReadMessageRequest>(request.Body);

            var userConnections = await _dbProvider.GetUserConnectionsById(data.SenderId);

            await _dbProvider.MessageSetSeenStatusAsync(data);

            var apiClient = new AmazonApiGatewayManagementApiClient(new AmazonApiGatewayManagementApiConfig
            {
                ServiceURL = endpoint
            });

            var stream = new MemoryStream(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(new { chatId = data.ChatId, message = $"Messages in chat {data.ChatId} have been read", isRead = true })));

            foreach (var connection in userConnections)
            {
                try
                {
                    var postRequest = new PostToConnectionRequest
                    {
                        ConnectionId = connection.ConnectionId,
                        Data = stream
                    };

                    context.Logger.LogLine($"Post to connection: {connection.ConnectionId}");
                    stream.Position = 0;
                    await apiClient.PostToConnectionAsync(postRequest);
                }
                catch (AmazonServiceException ex)
                {
                    if (ex.StatusCode == HttpStatusCode.Gone)
                    {
                        context.Logger.LogLine($"Connection {connection.ConnectionId} is gone");
                        await _dbProvider.DisconnectAsync(connection.ConnectionId);
                        context.Logger.LogLine($"{connection.ConnectionId} disconnected");
                    }
                    else
                    {
                        context.Logger.LogLine($"Posting read result to {connection.ConnectionId} failed: {ex.Message}");
                        context.Logger.LogInformation(ex.StackTrace);
                    }
                }
            }

            return new APIGatewayProxyResponse
            {
                StatusCode = (int)HttpStatusCode.OK,
                Body = $"Messages in chat {data.ChatId} have been read"
            };
        }
        catch (Exception ex) 
        {
            context.Logger.LogLine($"Failed to read messages: {ex.Message}");
            context.Logger.LogLine(ex.StackTrace);

            return new APIGatewayProxyResponse
            {
                StatusCode = (int)HttpStatusCode.InternalServerError,
                Body = $"Failed to read messages: {ex.Message}"
            };
        }
    }
}
