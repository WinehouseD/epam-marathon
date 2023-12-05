using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.Model;
using Amazon.Lambda.APIGatewayEvents;
using OnConnect.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace OnConnect.Services
{
    public class DbProvider
    {
        private readonly IDynamoDBContext _dynamoDbContext;

        public DbProvider()
        {
            var client = new AmazonDynamoDBClient();
            _dynamoDbContext = new DynamoDBContext(client);
        }

        public async Task<APIGatewayProxyResponse> ConnectAsync(string userId, string connectionId) 
        {
            await _dynamoDbContext.SaveAsync(new ConnectedUser 
            {
                ConnectionId = connectionId,
                UserId = userId
            });

            return new APIGatewayProxyResponse
            {
                StatusCode = (int)HttpStatusCode.OK,
                Headers = new Dictionary<string, string>
                {
                    { "Content-Type", "application/json" },
                    { "Access-Control-Allow-Origin", "*" }
                },
                Body = $"{userId} connected with connection {connectionId}"
            };
        }
    }
}
