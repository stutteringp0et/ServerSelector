# ServerSelector
Client side Javascript test to find the nearest (lowest latency) server.

I needed something to select between streaming media servers based on a users location, so this is what I came up with.

Setup is pretty simple.  The class is created with an options object.  Configuration properties are:

1. percent: a function taking one argument, an integer percentage.
2. result: a function taking one argument, an integer representing the index of the server which tested with the lowest latency
3. protocol: defaults to http
4. servers: an array of server hostnames
5. remoteFile: defaults to 'latency.png'

Just add the script to your document head, and initiate it with something like this.  
    
        <script type="text/javascript">
            window.addEventListener('DOMContentLoaded',function(){
                var options = {
                    percent:function(input){
                        document.getElementById('progress').innerHTML = input;
                    },
                    result:function(input){
                        var servers = [
                            'one.server.com',
                            'two.server.com',
                            'three.server.com'
                        ]
                        document.getElementById('result').innerHTML = servers[input];
                    },
                    protocol:'https',
                    servers:[
                        'one.server.com',
                        'two.server.com',
                        'three.server.com'
                    ],
                    remoteFile:'latency.png'
                };
                new ServerSelector(options);
            });            
        </script>
        
Using the percent and result functions, you can initiate other updates to your page or store the identified server for later use.  
