using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.Model;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OnConnect.Services;
using System.Net;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace OnConnect;

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
            var connetionId = request.RequestContext.ConnectionId;
            context.Logger.LogLine($"ConnectionId: {connetionId}");

            var userId = request.QueryStringParameters["userId"]?.ToString();

            return await _dbProvider.ConnectAsync(userId, connetionId);

        }
        catch (Exception e)
        {
            context.Logger.LogLine($"Error connection: {e.Message}");
            context.Logger.LogLine(e.StackTrace);

            return new APIGatewayProxyResponse
            {
                StatusCode = (int)HttpStatusCode.InternalServerError,
                Headers = new Dictionary<string, string>
                {
                    { "Content-Type", "application/json" },
                    { "Access-Control-Allow-Origin", "*" }
                },
                Body = $"Connection failed: {e.Message}"
            };
        }
    }
}
