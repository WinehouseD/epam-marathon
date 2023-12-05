using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OnDisconnect.Services;
using System.Net;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace OnDisconnect;

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
            var connectionId = request.RequestContext.ConnectionId;
            context.Logger.LogLine($"ConnectionId: {connectionId}");

            return await _dbProvider.DisconnectAsync(connectionId);
        }
        catch (Exception e) 
        {
            context.Logger.LogLine($"Disconnecting error: {e.Message}");
            context.Logger.LogLine(e.StackTrace);

            return new APIGatewayProxyResponse
            {
                StatusCode = (int)HttpStatusCode.InternalServerError,
                Headers = new Dictionary<string, string>
                {
                    { "Content-Type", "application/json" },
                    { "Access-Control-Allow-Origin", "*" }
                },
                Body = $"Failed to disconnect: {e.Message}"
            };
        }
    }
}
