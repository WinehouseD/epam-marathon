using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using GetUnreadMessages.Models;
using System.Net;
using System.Text.Json;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace GetUnreadMessages;

public class Function
{
    private readonly AmazonDynamoDBClient _client;
    private readonly DynamoDBContext _context;

    public Function()
    {
        _client = new AmazonDynamoDBClient();
        _context = new DynamoDBContext(_client);
    }

    public async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest request, ILambdaContext context)
    {
        var userId = request.QueryStringParameters["userId"];

        var unseenMessages = new QueryOperationConfig()
        {
            IndexName = "receiverId-seen-index",
            KeyExpression = new Expression()
            {
                ExpressionStatement = "receiverId = :user",
                ExpressionAttributeValues = new Dictionary<string, DynamoDBEntry>() { { ":user", userId } }
            }
        };

        var result = await _context.FromQueryAsync<ChatMessage>(unseenMessages).GetRemainingAsync();

        var groups = result.GroupBy(n => n.Id)
                     .Select(n => new GetUnreadMessagesResponse
                     {
                         ChatId = n.Key,
                         Count = n.Count()
                     })
                     .OrderBy(n => n.Count);

        return new APIGatewayProxyResponse 
        {
            StatusCode = (int)HttpStatusCode.OK,
            Headers = new Dictionary<string, string>
                {
                    { "Content-Type", "application/json" },
                    { "Access-Control-Allow-Origin", "*" }
                },

            Body = JsonSerializer.Serialize(groups)
        };
    }
}
