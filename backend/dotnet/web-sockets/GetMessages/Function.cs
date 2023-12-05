using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Amazon.Runtime.Internal;
using GetMessages.Models;
using System.Net;
using System.Text.Json;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace GetMessages;

public class Function
{
    private readonly AmazonDynamoDBClient _client;
    private readonly DynamoDBContext _context;

    public Function()
    {
        _client = new AmazonDynamoDBClient();
        _context = new DynamoDBContext(_client);
    }

    public async Task<APIGatewayProxyResponse> FunctionHandler
        (APIGatewayProxyRequest request, ILambdaContext context)
    {
        context.Logger.LogInformation(JsonSerializer.Serialize(request));
        var chatId = request.QueryStringParameters["chatId"];

        request.QueryStringParameters.TryGetValue("pageSize", out var pageSizeString);
        int.TryParse(pageSizeString, out var pageSize);
        pageSize = pageSize == 0 ? 50 : pageSize;

        if (pageSize > 1000 || pageSize < 1)
        {
            return new APIGatewayProxyResponse()
            {
                StatusCode = (int)HttpStatusCode.OK,
                Headers = new Dictionary<string, string>
                {
                    { "Content-Type", "application/json" },
                    { "Access-Control-Allow-Origin", "*" }
                },

                Body = "Invalid pageSize."
            };
        }

        request.QueryStringParameters.TryGetValue("lastid", out var lastId);

        var chatMessages = new QueryOperationConfig()
        {
            KeyExpression = new Expression()
            {
                ExpressionStatement = "id = :chatId",
                ExpressionAttributeValues = new Dictionary<string, DynamoDBEntry>() 
                { { ":chatId", chatId } }
            },
            Limit = pageSize,
            BackwardSearch = true
        };
        if (lastId != null)
        {
            chatMessages.PaginationToken = lastId;
        }

        var table = _context.GetTargetTable<ChatMessage>();
        var search = table.Query(chatMessages);
        var results = await search.GetNextSetAsync();
        context.Logger.LogInformation("Pagination token: " +search.PaginationToken);

        var items = _context.FromDocuments<ChatMessage>(results);

        return new APIGatewayProxyResponse
        {
            StatusCode = (int)HttpStatusCode.OK,
            Headers = new Dictionary<string, string>
                {
                    { "Content-Type", "application/json" },
                    { "Access-Control-Allow-Origin", "*" }
                },

            Body = JsonSerializer.Serialize(new 
                { search.PaginationToken, Messages = items }
                )
        };
    }
}