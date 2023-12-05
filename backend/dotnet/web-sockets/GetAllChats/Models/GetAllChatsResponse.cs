using Amazon.DynamoDBv2.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GetAllChats.Models
{
    public class GetAllChatsResponseItem
    {
        public string ChatId { get; set; }
        public long UpdateDt { get; set; }
        public User User1 { get; set; }
        public User User2 { get; set; }

        public GetAllChatsResponseItem()
        {
            
        }
        public GetAllChatsResponseItem(Chat chat)
        {
            this.ChatId = chat.ChatId;
            this.UpdateDt = chat.UpdateDt;
        }
    }
}
