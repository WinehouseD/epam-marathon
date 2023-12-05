using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Newtonsoft.Json;
using SendMessage.Models;
using SendMessage.Models.Request;
using SendMessage.Services;
using System.Net;
using Amazon.ApiGatewayManagementApi;
using System.Text;
using Amazon.ApiGatewayManagementApi.Model;
using System.Reflection;
using Amazon.Runtime;
using SendMessage.Extensions;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace SendMessage;

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

            var data = JsonConvert.DeserializeObject<SendMessageRequest>(request.Body);

            var userConnections = await _dbProvider.GetUserConnectionsById(data.ReceiverId);
            
            await _dbProvider.SaveChatAsync(new Chat { User1 = data.SenderId, User2 = data.ReceiverId, UpdateDt = DateTimeExtension.GetTimeStamp() });

            var messageId = await _dbProvider.AddMessageAsync(data);
            var messageResponse = data.ToMessageResponse(messageId.ToString());

            var apiClient = new AmazonApiGatewayManagementApiClient(new AmazonApiGatewayManagementApiConfig
            {
                ServiceURL = endpoint
            });

            var stream = new MemoryStream(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(messageResponse)));

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
                        context.Logger.LogLine($"Posting message to {connection.ConnectionId} failed: {ex.Message}");
                        context.Logger.LogInformation(ex.StackTrace);
                    }
                }
            }

            return new APIGatewayProxyResponse
            {
                StatusCode = (int)HttpStatusCode.OK,
                Body = $"Message has been posted"
            };
        }
        catch (Exception ex) 
        {
            context.Logger.LogLine($"Failed to post message: {ex.Message}");
            context.Logger.LogLine(ex.StackTrace);

            return new APIGatewayProxyResponse
            {
                StatusCode = (int)HttpStatusCode.InternalServerError,
                Body = $"Failed to post message: {ex.Message}"
            };
        }
    }
}
