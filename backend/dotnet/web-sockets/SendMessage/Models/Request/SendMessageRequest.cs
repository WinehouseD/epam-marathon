using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SendMessage.Models.Request
{
    public class SendMessageRequest
    {
        public string SenderName { get; set; }

        public string SenderAvatar { get; set; }

        public string SenderId { get; set; }

        public string ReceiverId { get; set; }

        public string Message { get; set; }
    }
}
