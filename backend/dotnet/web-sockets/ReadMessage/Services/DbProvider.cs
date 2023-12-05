using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Amazon.DynamoDBv2.DocumentModel;
using ReadMessage.Models;

namespace ReadMessage.Services
{
    public class DbProvider
    {
        private readonly IDynamoDBContext _dynamoDbContext;

        public DbProvider()
        {
            var client = new AmazonDynamoDBClient();
            _dynamoDbContext = new DynamoDBContext(client);
        }

        public async Task<IEnumerable<ConnectedUser>> GetUserConnectionsById(string userId)
        {
            return await _dynamoDbContext.QueryAsync<ConnectedUser>(userId, new DynamoDBOperationConfig
            {
                IndexName = "userId-index",
            }).GetNextSetAsync();
        }

        public async Task DisconnectAsync(string connectionId)
        {
            var connection = await _dynamoDbContext.LoadAsync<ConnectedUser>(connectionId);

            await _dynamoDbContext.DeleteAsync(connection);
        }

        public async Task<string> MessageSetSeenStatusAsync(ReadMessageRequest request) 
        {
            var message = new QueryOperationConfig()
            {
                KeyExpression = new Expression()
                {
                    ExpressionStatement = "id = :id",
                    ExpressionAttributeValues = new Dictionary<string, DynamoDBEntry>() { { ":id", request.ChatId } }
                }
            };
            var chat = await _dynamoDbContext.FromQueryAsync<ChatMessage>(message).GetRemainingAsync();
            var messageDocs = chat.Where(x => x.SenderId == request.SenderId && x.Seen != null);

            foreach (var doc in messageDocs) 
            {
                doc.Seen = null;
                await _dynamoDbContext.SaveAsync(doc);
            }

            return "";
        }
    }
}
