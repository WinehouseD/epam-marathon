using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReadMessage.Models
{
    public class ReadMessageRequest
    {
        public string ChatId { get; set; }

        public string SenderId { get; set; }
    }
}
