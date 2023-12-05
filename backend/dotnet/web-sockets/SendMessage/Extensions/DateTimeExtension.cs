using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SendMessage.Extensions
{
    public static class DateTimeExtension
    {
        public static long GetTimeStamp() 
        {
            return new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds();
        }
    }
}
