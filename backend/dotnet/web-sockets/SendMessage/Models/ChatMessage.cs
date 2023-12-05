using Amazon.DynamoDBv2.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SendMessage.Models
{
    [DynamoDBTable("it-marathon-v3-message-db")]
    public class ChatMessage
    {
        [DynamoDBHashKey("id")]
        public string Id { get; set; }

        [DynamoDBRangeKey("sendTime")]
        public long SentDtm { get; set; }
        
        [DynamoDBProperty("message")]
        public string Message { get; set; }
        
        [DynamoDBProperty("senderId")]
        public string SenderId { get; set; }
        
        [DynamoDBProperty("receiverId")]
        public string ReceiverId { get; set; }
        
        [DynamoDBProperty("seen")]
        public bool? Seen { get; set; }
    }
}
