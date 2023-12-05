using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using Amazon.Lambda.APIGatewayEvents;
using SendMessage.Extensions;
using SendMessage.Models;
using SendMessage.Models.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SendMessage.Services
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

        public async Task<string> AddMessageAsync(SendMessageRequest requestModel) 
        {
            var id = requestModel.SenderId.CompareTo(requestModel.ReceiverId) > 0 ? $"{requestModel.SenderId}-{requestModel.ReceiverId}" : $"{requestModel.ReceiverId}-{requestModel.SenderId}";

            var entity = requestModel.ToMessageEntity(id.ToString());

            await _dynamoDbContext.SaveAsync(entity);

            return id;
        }

        public async Task<string> SaveChatAsync(Chat chat) 
        {
            var id = chat.User1.CompareTo(chat.User2) > 0 ? $"{chat.User1}-{chat.User2}" : $"{chat.User2}-{chat.User1}";

            chat.ChatId = id;

            var user2 = new QueryOperationConfig() 
            {
                KeyExpression = new Expression()
                {
                    ExpressionStatement = "chatId = :chat",
                    ExpressionAttributeValues = new Dictionary<string, DynamoDBEntry>() { { ":chat", id } }
                }
            };

            var chatExists = await _dynamoDbContext.FromQueryAsync<Chat>(user2).GetRemainingAsync();
            if (chatExists.FirstOrDefault() != null)
            {
                return "Error";
            }

            await _dynamoDbContext.SaveAsync(chat);

            return id;
        }
    }
}
