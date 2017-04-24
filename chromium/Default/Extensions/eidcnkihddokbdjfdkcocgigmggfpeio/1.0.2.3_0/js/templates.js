(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/controls/grid_view/gridContextMenu.html', '<div class=\"contextmenu open\" ng-controller=\"gridContextMenuCtrl\">\r\n\r\n    <ul ng-if=\"itemApi.name == \'playlists\'\">        \r\n        <li ng-click=\"removePlaylist(selectedItem)\">Remove Playlist</li>\r\n    </ul>\r\n    <ul ng-if=\"itemApi.name == \'albums\'\">        \r\n        <li ng-click=\"playAlbum(selectedItem)\">Play Album</li>\r\n         <li ng-click=\"addToQueue(selectedItem)\">Add To Queue</li>\r\n    </ul>\r\n    <ul ng-if=\"itemApi.name == \'artists\'\">        \r\n        <li ng-click=\"playAlbum(selectedItem)\">Play Artist</li>\r\n         <li ng-click=\"addToQueue(selectedItem)\">Add To Queue</li>\r\n    </ul>\r\n    \r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/controls/grid_view/gridView.html', '<div>\r\n    <div class=\"album_container\" ng-repeat=\"item in items | orderBy:\'name\'  | filter:criteriaMatch()\" ng-click=\"onDblClick(item)\"  sp-right-click=\"itemApi.openListContextMenu($event, item)\" >\r\n        <div>\r\n            <div class=\"album_info\"><span>{{item.name}}</span><span>{{item.artist.name}}</span></div>\r\n            <div class=\"album_pic\" ng-style=\"getArtStyles(item)\" ng-class=\"{\'gdrive\': item.name==\'Google Drive\' && item.user,\'dropbox\': item.name==\'Dropbox\' && item.user,\'vk\': item.name==\'Vkontakte\' && item.user}\">\r\n                <span ng-class=\"{\'no_art\':item.albumArtPath.length==0}\">{{item.name[0]}}</span>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/controls/seeker/seeker.html', '<div class=\"seeker\">\r\n    <div class=\"line\" id=\"line\">\r\n        <div class=\"seek-progress\" id=\"seek-progress\"></div>\r\n    </div>\r\n    <div class=\"handler\"></div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/controls/tooltip/spTooltip.html', '<div class=\"tooltip\">\r\n    {{spTooltip}}\r\n</div>');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/controls/track_list/Index.html', '');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/controls/track_list/listContextMenu.html', '<div class=\"contextmenu\" ng-controller=\"listContextMenuCtrl\">\r\n    <ul ng-if=\"itemApi.name == \'songs\'\">\r\n        <li ng-if=\"!isPlaying(selectedTrack)\" ng-click=\"playTrack(selectedTrack)\">Play</li>\r\n        <li ng-if=\"isPlaying(selectedTrack)\" ng-click=\"stopTrack(selectedTrack)\">Stop</li>\r\n        <li ng-click=\"addToQueue(selectedTrack)\">Add To Queue</li>\r\n        <li ng-click=\"itemApi.goToAlbum(selectedTrack)\">Go To Album</li>\r\n        <li class=\"separator\"></li>\r\n            <li>Add To Playlist ...\r\n               <div class=\"contextmenu\">\r\n                <ul >\r\n                    <li ng-click=\"createPlaylist(selectedTrack)\">Create New Playlist ...</li>\r\n                    <li class=\"separator\"></li>\r\n                    <li ng-repeat=\"plist in playlists\" ng-click=\"addToPlaylist(selectedTrack, plist)\">{{plist.name}}</li>\r\n                </ul>\r\n              </div>   \r\n            </li>\r\n    </ul>\r\n    <ul ng-if=\"itemApi.name == \'album\'\" >\r\n        <li ng-if=\"!isPlaying(selectedTrack)\" ng-click=\"playTrack(selectedTrack)\">Play</li>\r\n        <li ng-if=\"isPlaying(selectedTrack)\" ng-click=\"stopTrack(selectedTrack)\">Stop</li>\r\n        <li ng-click=\"addToQueue(selectedTrack)\">Add To Queue</li>\r\n        <li class=\"separator\"></li>\r\n            <li>Add To Playlist ...\r\n               <div class=\"contextmenu\">   \r\n                    <ul>\r\n                        <li ng-click=\"createPlaylist(selectedTrack)\">Create New Playlist ...</li>\r\n                        <li class=\"separator\"></li>\r\n                        <li ng-repeat=\"plist in playlists\" ng-click=\"addToPlaylist(selectedTrack, plist)\">{{plist.name}}</li>\r\n                    </ul>\r\n                </div>\r\n            </li>   \r\n    </ul>\r\n    <ul ng-if=\"itemApi.name == \'queue\'\">\r\n        <li ng-if=\"!isPlaying(selectedTrack)\" ng-click=\"playTrack(selectedTrack)\">Play</li>\r\n        <li ng-if=\"isPlaying(selectedTrack)\" ng-click=\"stopTrack(selectedTrack)\">Stop</li>\r\n        <li ng-click=\"removeFromQueue(selectedTrack)\">Remove From Queue</li>\r\n        <li ng-click=\"clearQueue()\">Clear Queue</li>\r\n        <li class=\"separator\"></li>\r\n                <li>Add To Playlist ...\r\n                        <div class=\"contextmenu\">\r\n                            <ul>\r\n                                <li ng-click=\"createPlaylist(selectedTrack)\">Create New Playlist ...</li>\r\n                                <li class=\"separator\"></li>\r\n                                <li ng-repeat=\"plist in playlists\" ng-click=\"addToPlaylist(selectedTrack, plist)\">{{plist.name}}</li>\r\n                            </ul>\r\n                    </div>\r\n                </li>   \r\n    </ul>\r\n    <ul ng-if=\"itemApi.name == \'cloud\'\">\r\n        <li ng-if=\"!isPlaying(selectedTrack)\" ng-click=\"playTrack(selectedTrack)\">Play</li>\r\n        <li ng-if=\"isPlaying(selectedTrack)\" ng-click=\"stopTrack(selectedTrack)\">Stop</li>\r\n        <li ng-click=\"addToQueue(selectedTrack)\">Add To Queue</li>\r\n        <li class=\"separator\"></li>\r\n            <li>Add To Playlist ...\r\n              <div class=\"contextmenu\">\r\n                <ul>\r\n                    <li ng-click=\"createPlaylist(selectedTrack)\">Create New Playlist ...</li>\r\n                    <li class=\"separator\"></li>\r\n                    <li ng-repeat=\"plist in playlists\" ng-click=\"addToPlaylist(selectedTrack, plist)\">{{plist.name}}</li>\r\n                </ul>\r\n                </div> \r\n            </li>   \r\n    </ul>\r\n    <ul ng-if=\"itemApi.name == \'playlist\'\">\r\n        <li ng-if=\"!isPlaying(selectedTrack)\" ng-click=\"playTrack(selectedTrack)\">Play</li>\r\n        <li ng-if=\"isPlaying(selectedTrack)\" ng-click=\"stopTrack(selectedTrack)\">Stop</li>\r\n        <li ng-click=\"removeFromPlaylist(selectedTrack)\">Remove From Playlist</li>\r\n    </ul>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/controls/track_list/trackList.html', '<div>\r\n<div class=\"list_view_item\"    ng-repeat=\"track in items | orderBy:itemApi.orderBy\" tabindex=\"-1\" ng-mousedown=\"selectTrack(track, $event)\"  ng-class=\"{selected: isSelected(track), \'playing-item\': isPlaying(track)}\" ng-dblclick=\"playTrack(track)\" sp-right-click=\"itemApi.openListContextMenu($event, track)\">\r\n    <span >{{track.title}}</span>\r\n    <span>{{track.album.artist.name}}</span>\r\n    <span>{{track.duration | duration}}</span>\r\n    <div class=\"eq_cont\">\r\n        <svg x=\"0\" y=\"0\" height=\"40\" width=\"50\">\r\n            <rect x=\"0\" y=\"15\" height=\"10\" width=\"2\"></rect>\r\n            <rect x=\"4\" y=\"10\" height=\"20\" width=\"2\"></rect>\r\n            <rect x=\"8\" y=\"5\" height=\"30\" width=\"2\"></rect>\r\n            <rect x=\"12\" y=\"2.5\" height=\"35\" width=\"2\"></rect>\r\n            <rect x=\"16\" y=\"5\" height=\"30\" width=\"2\"></rect>\r\n            <rect x=\"20\" y=\"7.5\" height=\"25\" width=\"2\"></rect>\r\n            <rect x=\"24\" y=\"12.5\" height=\"15\" width=\"2\"></rect>\r\n        </svg>\r\n    </div>\r\n    <svg class=\"material_ink\"><circle r=\"100%\" cx=\"0\" cy=\"0\" fill=\"rgba(255,255,255,.4)\" /></svg>\r\n\r\n</div>      \r\n</div>\r\n\r\n\r\n\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/controls/volume/volume.html', '<div class=\"control_button\" data-vol=\"true\" id=\"vol\" ripple-effect ng-class=\"{open: isOpened}\">\r\n    <span class=\"icon speaker\" sp-tooltip=\"Volume\"  sp-tooltip-position=\"top\" data-vol=\"true\" id=\"vol-toggle\"   ng-click=\"toggleVolume()\"></span>\r\n       <svg class=\"material_ink\"><circle r=\"100%\" cx=\"0\" cy=\"0\" fill=\"rgba(255,255,255,.4)\" /></svg>\r\n    <div class=\"volume\" data-vol=\"true\">\r\n        <div class=\"vol-line\" data-vol=\"true\" id=\"vol-line\"></div>\r\n        <div class=\"vol-handler\" data-vol=\"true\" id=\"vol-handler\">\r\n            <div id=\"vol-label\">\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <svg class=\"material_ink\"><circle r=\"100%\" cx=\"0\" cy=\"0\" fill=\"rgba(255,255,255,.4)\" /></svg>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/albums/album.html', '<div class=\"album-detail\" id=\"album_detail\" ng-controller=\"albumCtrl\">\r\n    <div class=\"info_container\">\r\n        <div class=\"album_info\" id=\"album_info\">\r\n            <span>{{album.name}}</span> <span>{{album.artist.name}}</span>\r\n        </div>\r\n        <div class=\"album_pic\"><div class=\"album_art\" id=\"album_pic\" ng-style=\"getArtStyles()\"></div></div>\r\n    </div>\r\n    <div class=\"wrapper\" id=\"sub-wrapper\"  sp-stick  scrollbar-root>\r\n        <div class=\"list_view open\">\r\n            <track-list items=\"album.tracks\" item-api=\"itemApi\"></track-list>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/albums/albums.html', '<grid-view  items=\"albums\" item-api=\"itemApi\"></grid-view>');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/artists/artist.html', '<div class=\"artist-detail\" id=\"artist_detail\"  ng-controller=\"artistCtrl\">\r\n    <div class=\"info_container\">\r\n        <div class=\"album_info\" id=\"artist_info\">\r\n            <span>{{artist.name}}</span> <span>{{statistics.albumsCount}} albums / {{statistics.tracksCount}} tracks</span>\r\n        </div>\r\n        <div class=\"album_pic\" id=\"artist_pic\"></div>\r\n    </div>\r\n    <div class=\"wrapper\" id=\"sub-wrapper-artist\" sp-stick>\r\n        <div class=\"grid_view album_grid_view\">\r\n            <grid-view items=\"artist.albums\" item-api=\"itemApi\"></grid-view>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/artists/artists.html', '<grid-view  items=\"artists\"  item-api=\"itemApi\"></grid-view>');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/clouds/cloud.html', '<div class=\"cloud-detail\" id=\"cloud_detail\" ng-controller=\"cloudCtrl\">s\r\n    <div class=\"info_container\">\r\n        <div class=\"album_info\" id=\"cloud_info\">\r\n            <span>{{cloud.name}}</span> <span></span>\r\n            <!--<input placeholder=\"Search here\" ng-model=\"searchKeyword\" type=\"search\"/>-->\r\n        </div>\r\n        <div class=\"album_pic\" id=\"cloud_pic\"></div>\r\n    </div>\r\n    <div class=\"wrapper\" id=\"sub-wrapper-cloud\"   sp-stick  scrollbar-root>\r\n        <div class=\"list_view open\">\r\n            <track-list items=\"cloud.tracks\" item-api=\"itemApi\"></track-list>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/clouds/clouds.html', '<grid-view  items=\"clouds\"  item-api=\"itemApi\"></grid-view>');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/mediaSources/mediaSources.html', '<div class=\"add_source window\" ng-controller=\"mediaSourceCtrl\">\r\n    <div class=\"sub_title\">\r\n        Media Sources\r\n    </div>\r\n    <div class=\"wrapper\">\r\n        <h2>Local Sources</h2>\r\n        <h3>Add or Remove Folders</h3>\r\n        <p>Player monitors folders for changes at startup or while running, and automatically updates the library. </p>\r\n        <div class=\"options\">\r\n            <button id=\"addLocalBtn\" ng-click=\"addLocalFolder()\"><icon class=\"icon add\"></icon>Add folder</button>\r\n            <button  class=\"white\" ng-click=\"scanLibrary()\"></span><icon class=\"icon search_dark\"></icon>Scan Library</button>\r\n        </div>\r\n\r\n\r\n\r\n<div class=\"options\">\r\n            <ul class=\"local source_list\" id=\"foldersList\">\r\n            <li ng-repeat=\"folder in localFolders\"><icon class=\"folder_dark\"></icon><span>{{folder.physicalPath}}</span><icon class=\"icon remove\" ng-click=\"removeLocalFolder(folder)\"></icon></li>\r\n        </ul>\r\n</div>\r\n        <div class=\"separator\"></div>\r\n        <h2>Cloud Storages</h2>\r\n        <h3>Add or Remove Cloud Storages</h3>\r\n        <p>Here you can add your cloud music files to the player. Your songs will be displayed in cloud list.</p>\r\n        <div class=\"options\">\r\n            <button class=\"white \" id=\"gdriveBtn\" ng-click=\"enableGoogleDrive()\">google drive</button>\r\n                                <ul class=\"source_list\" ng-show=\"gdrive.user\">\r\n                <li><span>{{gdrive.user}}</span><icon class=\"icon remove\" ng-click=\"removeCloud(gdrive)\"></icon></li>\r\n            </ul>\r\n        </div>\r\n\r\n                    <div class=\"separator\"></div>\r\n        <div class=\"options\">\r\n            <button class=\"white \" id=\"dropboxBtn\" ng-click=\"enableDropbox()\">drop box</button>\r\n                    <ul class=\"source_list\" ng-show=\"dropbox.user\">\r\n                <li><span>{{dropbox.user}}</span><icon class=\"icon remove\" ng-click=\"removeCloud(dropbox)\"></icon></li>\r\n            </ul>\r\n        </div>\r\n\r\n        <div class=\"separator\"></div>\r\n        <div class=\"options\">\r\n            <button class=\"white \" ng-click=\"enableVkontakte()\">Vkontakte</button>\r\n                    <ul class=\"source_list\"  ng-show=\"vkontakte.user\">\r\n                <li><span>{{vkontakte.user}}</span><icon class=\"icon remove\" ng-click=\"removeCloud(vkontakte)\"></icon></li>\r\n            </ul>\r\n        </div>\r\n        <div class=\"separator\"></div>\r\n        <div class=\"options\">\r\n            <button class=\"white \" ng-click=\"enableOneDrive()\">OneDrive</button>\r\n                    <ul class=\"source_list\"  ng-show=\"oneDrive.user\">\r\n                <li><span>{{oneDrive.user}}</span><icon class=\"icon remove\" ng-click=\"removeCloud(oneDrive)\"></icon></li>\r\n            </ul>\r\n        </div>\r\n\r\n        <!-- <div class=\"options\">\r\n            <button ng-click=\"enableSpotify()\">Spotify</button>\r\n            <ul class=\"source_list\" style=\"width:300px\" ng-show=\"spotify.user\">\r\n                <li><span>{{spotify.user}}</span><span class=\"icon remove\" ng-click=\"removeCloud(spotify)\"></span></li>\r\n            </ul>\r\n        </div> -->\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/menu/menu.html', '<div class=\"drop_menu\"  ng-controller=\"menuCtrl\" ng-click=\"$event.stopPropagation();$closeDialog()\">\r\n    <ul>\r\n        <li ng-click=\"openMediaSources()\"><span class=\"icon media\"></span>Media Sources</li>\r\n\r\n        <separator></separator>\r\n\r\n        <li ng-click=\"openSettings()\"><span class=\"icon settings\"></span>Settings</li>\r\n\r\n        <li ng-click=\"openAboutDialog()\"><span class=\"icon info\"></span>About</li>\r\n\r\n        <separator></separator>\r\n\r\n        <li ng-click=\"openFeedbackDialog()\"><span class=\"icon feedback\"></span>Feedback</li>   \r\n         <!--<li ng-click=\"checkForUpdates()\"><span class=\"icon feedback\"></span>Check For Updates</li>  -->\r\n    </ul>\r\n</div>');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/now_playing/nowPlaying.html', '<div class=\"now_playing\" ng-click=\"toggleQueue()\" ng-controller=\"nowPlayingCtrl\" >\r\n    <div class=\"cover_container\" id=\"cover\"><span class=\"icon cd\"></span></div>\r\n    \r\n    <span id=\"artist-name\" class=\"artist_name\" ng-if=\"getQueue().length!=0\">{{track.album.artist.name}}</span>\r\n\r\n    <span id=\"song-name\" class=\"song_name\" ng-if=\"getQueue().length!=0\">{{track.title}}</span>\r\n\r\n    <span id=\"artist-name\" class=\"artist_name\"  ng-if=\"getQueue().length==0\">Start some music or click on an album, song, or playlist ...</span>\r\n    <span id=\"song-name\" class=\"song_name\" ng-if=\"getQueue().length==0\">Your queue is empty</span>\r\n\r\n     <span id=\"song-length\" class=\"song_duration\" ng-class=\"{reversed:timerReversed}\" current-time ng-click=\"$event.stopPropagation();toggleReverse()\">\r\n         <span><span>0 1 2 3 4 5 6 7 8 9 0 1</span></span>\r\n         <span><span>0 1 2 3 4 5 6 7 8 9 0 1</span></span>\r\n         \r\n         <span>:</span>\r\n\r\n         <span><span>0 1 2 3 4 5 6 7 8 9 0 1</span></span>\r\n         <span><span>0 1 2 3 4 5 6 7 8 9 0 1</span></span>\r\n     </span>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/playback/playback.html', ' <div class=\"controls\" id=\"play_controls\" ng-class=\"{playing: isPlaying()}\" ng-controller=\"playbackCtrl\">\r\n\r\n            <svg class=\"mtrl_fill\" ><circle r=\"30\" cx=\"50%\" cy=\"50%\" fill=\"white\"/></svg>\r\n\r\n            <div class=\"play_button_holder\">\r\n                <div class=\"control_button\" sp-tooltip=\"{{playBtnTitle()}}\"  ripple-effect sp-tooltip-position=\"top\" sp-tooltip-update=\"true\"  id=\"play\" ng-click=\"playPause()\">\r\n                    <span class=\"icon play\"></span>\r\n                    <svg class=\"material_ink\"><circle r=\"100%\" cx=\"0\" cy=\"0\" fill=\"rgba(255,255,255,.4)\" /></svg>\r\n                </div>\r\n\r\n            </div>\r\n            <div class=\"control_button\" ripple-effect  sp-tooltip=\"Previous Song\" sp-tooltip-position=\"top\"  id=\"prev\" ng-click=\"prevTrack()\">\r\n                <span class=\"icon prev\"></span>\r\n                <svg class=\"material_ink\"><circle r=\"100%\" cx=\"0\" cy=\"0\" fill=\"rgba(255,255,255,.4)\" /></svg>\r\n            </div>\r\n\r\n            <div class=\"control_button\"  ripple-effect  sp-tooltip=\"Next Song\" sp-tooltip-position=\"top\" id=\"next\" ng-click=\"nextTrack()\">\r\n                <span class=\"icon next\"></span>\r\n                <svg class=\"material_ink\"><circle r=\"100%\" cx=\"0\" cy=\"0\" fill=\"rgba(255,255,255,.4)\" /></svg>\r\n            </div>\r\n\r\n            <div class=\"control_button\"  ripple-effect   sp-tooltip=\"{{shuffleBtnTitle()}}\" sp-tooltip-position=\"top\"  id=\"shuffleBtn\" ng-class=\"{\'shuffle-on\':playback.shuffle}\" ng-click=\"toggleShuffle()\">\r\n                <span class=\"icon shuffle\"></span>\r\n               <svg class=\"material_ink\"><circle r=\"100%\" cx=\"0\" cy=\"0\" fill=\"rgba(255,255,255,.4)\" /></svg>\r\n            </div>\r\n\r\n            \r\n            \r\n            <div class=\"control_button\" ripple-effect   sp-tooltip=\"{{repeatBtnTitle()}}\" sp-tooltip-position=\"top\"  id=\"repeatBtn\" ng-class=\"{\'repeat-all\': playback.repeat ==1, \'repeat-one\':playback.repeat == 0}\" ng-click=\"toggleRepeatMode()\">\r\n                <span class=\"icon repeat\"></span>\r\n                <svg class=\"material_ink\"><circle r=\"100%\" cx=\"0\" cy=\"0\" fill=\"rgba(255,255,255,.4)\" /></svg>\r\n            </div>\r\n\r\n            <div class=\"control_button\"  ripple-effect    sp-tooltip=\"Queue\" sp-tooltip-position=\"top\"  id=\"bass\" ng-click=\"toggleQueue()\">\r\n                <span class=\"icon play_list\"></span>\r\n               <svg class=\"material_ink\"><circle r=\"100%\" cx=\"0\" cy=\"0\" fill=\"rgba(255,255,255,.4)\" /></svg>\r\n            </div>\r\n \r\n            <volume></volume>\r\n            <seeker sp-tooltip=\"Seek\" sp-tooltip-position=\"top\" ></seeker>\r\n            \r\n\r\n        </div>');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/playlists/createNewPlaylist.html', '<div class=\"modal_container\">\r\n<div ng-controller=\"createNewPlaylistCtrl\" class=\"new_playlist_modal\">\r\n    <form ng-submit=\"savePlaylist()\">\r\n\r\n	    <div class=\"help_tip\">\r\n	        <h3>Create Playlist</h1>\r\n	        <p>Enter the playlist\'s name and click save ...</p>\r\n	    </div>\r\n\r\n		<div class=\"input_panel\">\r\n		\r\n	        <input placeholder=\"Playlist name\" ng-model=\"playlistName\" autofocus pattern=\".*\\S+.*\" required=\"\" tabindex=\"-1\" type=\"text\"/>\r\n	        <button class=\"white mini\" type=\"reset\"> <icon class=\"icon close_dark\"></icon> </button>\r\n\r\n\r\n        <div class=\"command_panel\">\r\n	        <button class=\"primary\"  ng-click=\"savePlaylist()\">Save</button>\r\n	        <button class=\"white\" ng-click=\"closeDialog()\">Cancel</button>\r\n        </div>\r\n\r\n\r\n        </div>\r\n\r\n       \r\n    \r\n    </form>\r\n</div>\r\n</div>');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/playlists/playlist.html', '<div class=\"playlist-detail\" id=\"playlist_detail\" ng-controller=\"playlistCtrl\">\r\n    <div class=\"info_container\">\r\n        <div class=\"album_info\" id=\"playlist_info\">\r\n            <span>{{playlist.name}}</span><span>{{playlist.tracks.length}} tracks</span>\r\n\r\n        </div>\r\n        <div class=\"album_pic\" id=\"playlist_pic\"></div>\r\n    </div>\r\n    <div class=\"wrapper\" id=\"sub-wrapper-playlist\"  sp-stick scrollbar-root>\r\n        <div class=\"list_view open\">\r\n            <track-list items=\"playlist.tracks\"  item-api=\"itemApi\"></track-list>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/playlists/playlists.html', '<grid-view  items=\"playlists\" item-api=\"itemApi\"></grid-view>');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/queue/queue.html', '\r\n    <div id=\"queue_list\" class=\"wrapper\" scrollbar-root>\r\n    	<div class=\"list_view open\">\r\n    	<track-list  items=\"tracks\" item-api=\"itemApi\"></track-list>\r\n    	</div>\r\n    </div>\r\n    <div class=\"temporary play_list_save\">\r\n        <form ng-submit=\"savePlaylist(playlistObj)\" ng-if=\"tracks.length!=0\">\r\n            <input type=\"text\" ng-model=\"playlistObj.playlistName\" placeholder=\"Save List As ...\" pattern=\".*\\S+.*\" required />\r\n               <span><svg><circle r=\"0\" cx=\"20\" cy=\"20\" fill=\"rgba(0,0,0,.1)\"></circle></svg></span>\r\n            <input class=\"list_save\" type=\"submit\" autofocus id=\"playlistSaveBtn\" value=\"Save\">\r\n\r\n        </form>\r\n\r\n    </div>\r\n\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/quickActions/quickActions.html', '<div ng-controller=\"quickActionsCtrl\" class=\"quick_actions_container\">\r\n    <div class=\"quick_actions_wrapper\">\r\n<div class=\"quick_action\">\r\n    <div class=\"help_tip\">\r\n                <h4>Hi There!</h4>\r\n\r\n                <p>\r\n                   There are no items in your library. Click media sources to include folders in your library. \r\n                </p>\r\n            </div>\r\n            <button ng-click=\"openMediaSources()\">Add Media Source</button>\r\n\r\n</div>\r\n</div>\r\n</div>');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/search/search.html', '\r\n  <track-list items=\"searchResult\"  item-api=\"itemApi\"></track-list>\r\n\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/settings/settings.html', '<div class=\"setting window\" id=\"settings\" ng-controller=\"settingsCtrl\">\r\n    <div class=\"sub_title\">\r\n        Settings\r\n    </div>\r\n    <div class=\"wrapper\">\r\n        <h2>Music & Playback</h2>\r\n        <h3>Here you can manage the main settings of your player</h3>\r\n        <p>Check the boxes to customize your player\'s behavior.</p>\r\n        <div class=\"options settings\">\r\n            <label   sp-tooltip=\"Automatically Play Newly Added Songs\" >\r\n                <input class=\"stngs-option\" type=\"checkbox\" ng-model=\"settings.autoPlay\"><span>Autoplay</span></label>\r\n            <label sp-tooltip=\"Album Art On Player Background During Playback\">\r\n                <input class=\"stngs-option\" ng-model=\"settings.showAlbumArt\" type=\"checkbox\"><span>Show Album Art On Background</span></label>\r\n            <label sp-tooltip=\"Select This To Keep Player Above Other Windows\">\r\n                <input class=\"stngs-option\" ng-model=\"settings.alwaysTop\" type=\"checkbox\"><span>Always On Top</span></label>\r\n        </div>\r\n        <div class=\"separator\"></div>\r\n        <h2>Color Scheme</h2>\r\n        <h3>Change The Visuals For Your Player</h3>\r\n        <p>Click a Theme To Change The Color Scheme</p>\r\n        <div class=\"options settings\">\r\n            <label sp-tooltip=\"Sea Green, click to apply theme\">\r\n                <input class=\"stngs-theme\" ng-model=\"settings.theme\" name=\"theme\" value=\"primary.css\" type=\"radio\"><span>Sea Green<span>Default</span></span>\r\n            </label>\r\n\r\n            <label sp-tooltip=\"Pistachio, click to apply theme\">\r\n                <input class=\"stngs-theme\"  ng-model=\"settings.theme\" name=\"theme\" value=\"secondary.css\" type=\"radio\"><span>Pistachio</span>\r\n                </label>\r\n\r\n            <label sp-tooltip=\"Iron Man, click to apply theme\">\r\n                <input class=\"stngs-theme\"  ng-model=\"settings.theme\" name=\"theme\" value=\"ironman.css\"  type=\"radio\"><span>Iron Man</span>\r\n                </label>\r\n\r\n                 <label sp-tooltip=\"Raspberry Indigo, click to apply theme\">\r\n                <input class=\"stngs-theme\"  ng-model=\"settings.theme\" name=\"theme\" value=\"strawberry.css\"  type=\"radio\"><span>Raspberry Indigo</span>\r\n                </label>\r\n\r\n        </div>\r\n        <div class=\"separator\"></div>\r\n        <div class=\"options\">\r\n            <button  ng-click=\"resetSettings()\">Restore Defaults</button>\r\n            <button class=\"white\" ng-click=\"clearData()\">Clear Data</button>\r\n           \r\n        </div>\r\n\r\n        <div class=\"separator\"></div>\r\n        <h2>information</h2>\r\n        <h3>Copyright &copy; 2016 Salmon Player</h3>\r\n        <p>All rights reserved.</p>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/songs/songs.html', '\r\n<track-list  items=\"tracks\" item-api=\"itemApi\"></track-list>\r\n\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/tab/tab.html', '<div class=\"nav\" ng-controller=\"tabCtrl\">\r\n    <ul id=\"nav\">\r\n        <li ng-class=\"{active: getCurrentView() === \'allsongs\'}\" id=\"allsongs\" ng-click=\"setCurrentView(\'allsongs\')\">Songs</li>\r\n        <li ng-class=\"{active: getCurrentView() === \'allalbums\'}\" id=\"allalbums\" ng-click=\"setCurrentView(\'allalbums\')\">Albums</li>\r\n        <li ng-class=\"{active: getCurrentView() === \'allartists\'}\" id=\"allartists\" ng-click=\"setCurrentView(\'allartists\')\">Artists</li>\r\n        <li ng-class=\"{active: getCurrentView() === \'allplaylists\'}\" id=\"allplaylists\" ng-click=\"setCurrentView(\'allplaylists\')\">Playlists</li>\r\n        <li ng-class=\"{active: getCurrentView() === \'allclouds\'}\" id=\"allclouds\" ng-click=\"setCurrentView(\'allclouds\')\">Cloud</li>\r\n    </ul>\r\n</div> \r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/update/updateDialog.html', '<div class=\"modal_container\" ng-controller=\"updateDialogCtrl\">\r\n<div class=\"new_playlist_modal\">\r\n	    <div class=\"help_tip\">\r\n	        <h3>Update is available </h1>\r\n	        <p>Salmon Player will be updated after it restarts.</p>\r\n	    </div>\r\n		<div class=\"command_panel\">\r\n	        <button class=\"primary\"  ng-click=\"installUpdate()\">Update Now</button>\r\n	        <button class=\"white\" ng-click=\"closeDialog()\">Later</button>\r\n        </div>   \r\n</div>\r\n</div>');
    }]);
})();

//# sourceMappingURL=templates.js.map