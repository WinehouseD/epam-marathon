using Amazon.Lambda.APIGatewayEvents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SendMessage.Extensions
{
    public static class ApiGatewayRequestExtension
    {
        public static string GetEndpoint(this APIGatewayProxyRequest request) 
        {
            var domain = request.RequestContext.DomainName;
            var stage = request.RequestContext.Stage;
            return $"https://{domain}/{stage}";
        }
    }
}
