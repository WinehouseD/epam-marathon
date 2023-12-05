using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2;
using Amazon.Lambda.APIGatewayEvents;
using OnDisconnect.Models;
using System.Net;
using Amazon.DynamoDBv2.DocumentModel;

namespace OnDisconnect.Services
{
    public class DbProvider
    {
        private readonly IDynamoDBContext _dynamoDbContext;

        public DbProvider()
        {
            var client = new AmazonDynamoDBClient();
            _dynamoDbContext = new DynamoDBContext(client);
        }

        public async Task<APIGatewayProxyResponse> DisconnectAsync(string connectionId)
        {
            var connection = await _dynamoDbContext.LoadAsync<ConnectedUser>(connectionId);
            
            await _dynamoDbContext.DeleteAsync(connection);

            return new APIGatewayProxyResponse
            {
                StatusCode = (int)HttpStatusCode.OK,
                Headers = new Dictionary<string, string>
                {
                    { "Content-Type", "application/json" },
                    { "Access-Control-Allow-Origin", "*" }
                },
                Body = $"Connection {connectionId} closed"
            };
        }
    }
}
