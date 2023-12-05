using Amazon.DynamoDBv2.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SendMessage.Models
{
    [DynamoDBTable("it-marathon-v3-user-conect-db")]
    public class ConnectedUser
    {
        [DynamoDBHashKey("connectionId")]
        public string ConnectionId { get; set; }

        [DynamoDBProperty("userId")]
        [DynamoDBGlobalSecondaryIndexHashKey("userId-index")]
        public string UserId { get; set; }
    }
}
