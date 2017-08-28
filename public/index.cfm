<cfif NOT fileExists(expandPath('.') & '/bundle.js')>
  <cflocation url="./" addtoken="no">
</cfif>

<!DOCTYPE html>
<html>
    <head>
        <title><cfoutput>#timeFormat(now(),'hh:mm:ss tt')#</cfoutput></title>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
        <meta name="format-detection" content="telephone=no">
    </head>
    <body>
      <noscript>
        You need to enable JavaScript to run this app.
      </noscript>
      <div id="root"></div> 
      <script src="./public/bundle.js"></script>   
    </body>
</html>
