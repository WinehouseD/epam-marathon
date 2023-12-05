using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GetUnreadMessages.Models
{
    public class GetUnreadMessagesResponse
    {
        public string ChatId { get; set; }
        public int Count { get; set; }  
    }
}
