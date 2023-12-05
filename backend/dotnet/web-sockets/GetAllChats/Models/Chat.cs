using Amazon.DynamoDBv2.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GetAllChats.Models
{
    [DynamoDBTable("it-marathon-v3-chat-db")]
    public class Chat
    {
        [DynamoDBHashKey("chatId")]
        public string ChatId { get; set; }

        [DynamoDBRangeKey("updatedDt")]
        public long UpdateDt { get; set; }

        [DynamoDBProperty("user1")]
        public string User1 { get; set; }

        [DynamoDBProperty("user2")]
        public string User2 { get; set; }

        public override string? ToString()
        {
            return $"{ChatId} {UpdateDt} {User1} {User2}";
        }
    }
}
