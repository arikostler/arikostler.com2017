/**
 * Created by Arik on 2/25/2017.
 */

$(document).ready(function () {
    let token = $.cookie('auth');
    if (token) {
        let payload = getPayloadFromToken(token);
        console.log(payload);
        if (!!token) {
            $('#userinfo').html('<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">' +
                '       <i class="glyphicon glyphicon-user"></i>' +
                '       <b>' + payload.displayName + '</b><i class="caret"></i>' +
                '   </a>' +
                '   <ul class="dropdown-menu">' +
                '       <li><a href="#settings"><i class="glyphicon glyphicon-cog"></i> Settings</a></li>' +
                '       <li><a href="#myProfile"><i class="glyphicon glyphicon-pencil"></i> My Profile</a></li>' +
                '       <li role="separator" class="divider"></li>' +
                '<li><a href="/api/auth/logout"><i class="glyphicon glyphicon-off"></i> Logout</a></li>' +
                '   </ul>');
        }
    }
});

function getPayloadFromToken(token) {
    let parts = token.split('.');
    return JSON.parse(atob(parts[1]));
}