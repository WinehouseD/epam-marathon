using Amazon.DynamoDBv2.DataModel;

namespace GetAllChats.Models
{
    [DynamoDBTable("it-marathon-v3-user-db")]
    public class User
    {
        [DynamoDBHashKey("email")]
        public string Email { get; set; }
        [DynamoDBProperty("avatar")]
        public string Avatar { get; set; }
        [DynamoDBProperty("name")]
        public string Name { get; set; }
    }
}