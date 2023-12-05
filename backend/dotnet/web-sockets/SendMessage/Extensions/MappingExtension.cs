using SendMessage.Models;
using SendMessage.Models.Request;
using SendMessage.Models.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SendMessage.Extensions
{
    public static class MappingExtension
    {
        public static ChatMessage ToMessageEntity(this SendMessageRequest model, string id) 
        {
            return new ChatMessage 
            {
                Id = id,
                Message = model.Message,
                ReceiverId = model.ReceiverId,
                SenderId = model.SenderId,
                SentDtm = DateTimeExtension.GetTimeStamp(),
                Seen = false
            };
        }

        public static MessageResponse ToMessageResponse(this SendMessageRequest model, string id) 
        {
            return new MessageResponse
            {
                Id = id,
                Message = model.Message,
                SenderAvatar = model.SenderAvatar,
                SenderId = model.SenderId,
                SenderName = model.SenderName,
                Time = DateTime.Now.ToString("u")
            };
        }
    }
}
