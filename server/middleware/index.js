
exports.detectUserDeviceType = function(req, res, next) {
    var userAgent = req.get('user-agent') || '';
    // Set req.userDevice <String>, and proceed
    req.userDevice = getUserDeviceType(userAgent);
    next();
};

var getUserDeviceType = function (userAgent) {
    if (userAgent.match(/GoogleTV|SmartTV|Internet TV|NetCast|NETTV|AppleTV|boxee|Kylo|Roku|DLNADOC|CE\-HTML/i)) {
        // if user agent is a smart TV - http://goo.gl/FocDk
        return 'tv';
    } else if (userAgent.match(/Xbox|PLAYSTATION 3|Wii/i)) {
        // if user agent is a TV Based Gaming Console
        return 'tv';
    } else if (userAgent.match(/iP(a|ro)d/i) || (userAgent.match(/tablet/i) && !userAgent.match(/RX-34/i)) || userAgent.match(/FOLIO/i)) {
        // if user agent is a Tablet
        return 'tablet';
    } else if (userAgent.match(/Linux/i) && userAgent.match(/Android/i) && !userAgent.match(/Fennec|mobi|HTC Magic|HTCX06HT|Nexus One|SC-02B|fone 945/i)) {
        // if user agent is an Android Tablet
        return 'tablet';
    } else if (userAgent.match(/Kindle/i) || (userAgent.match(/Mac OS/i) && userAgent.match(/Silk/i))) {
        // if user agent is a Kindle or Kindle Fire
        return 'tablet';
    } else if (userAgent.match(/GT-P10|SC-01C|SHW-M180S|SGH-T849|SCH-I800|SHW-M180L|SPH-P100|SGH-I987|zt180|HTC( Flyer|_Flyer)|Sprint ATP51|ViewPad7|pandigital(sprnova|nova)|Ideos S7|Dell Streak 7|Advent Vega|A101IT|A70BHT|MID7015|Next2|nook/i) || (userAgent.match(/MB511/i) && userAgent.match(/RUTEM/i))) {
        // if user agent is a pre Android 3.0 Tablet
        return 'tablet';
    } else if (userAgent.match(/BOLT|Fennec|Iris|Maemo|Minimo|Mobi|mowser|NetFront|Novarra|Prism|RX-34|Skyfire|Tear|XV6875|XV6975|Google Wireless Transcoder/i)) {
        // if user agent is unique phone User Agent
        return 'phone';
    } else if (userAgent.match(/Opera/i) && userAgent.match(/Windows NT 5/i) && userAgent.match(/HTC|Xda|Mini|Vario|SAMSUNG\-GT\-i8000|SAMSUNG\-SGH\-i9/i)) {
        // if user agent is an odd Opera User Agent - http://goo.gl/nK90K
        return 'phone';
    } else if ((userAgent.match(/Windows (NT|XP|ME|9)/) && !userAgent.match(/Phone/i)) && !userAgent.match(/Bot|Spider|ia_archiver|NewsGator/i) || userAgent.match(/Win( ?9|NT)/i)) {
        // if user agent is Windows Desktop
        return 'desktop';
    } else if (userAgent.match(/Macintosh|PowerPC/i) && !userAgent.match(/Silk/i)) {
        // if agent is Mac Desktop
        return 'desktop';
    } else if (userAgent.match(/Linux/i) && userAgent.match(/X11/i) && !userAgent.match(/Charlotte/i)) {
        // if user agent is a Linux Desktop
        return 'desktop';
    } else if (userAgent.match(/CrOS/)) {
        // if user agent is a Chrome Book
        return 'desktop';
    } else if (userAgent.match(/Solaris|SunOS|BSD/i)) {
        // if user agent is a Solaris, SunOS, BSD Desktop
        return 'desktop';
    } else if (userAgent.match(/curl|Bot|B-O-T|Crawler|Spider|Spyder|Yahoo|ia_archiver|Covario-IDS|findlinks|DataparkSearch|larbin|Mediapartners-Google|NG-Search|Snappy|Teoma|Jeeves|Charlotte|NewsGator|TinEye|Cerberian|SearchSight|Zao|Scrubby|Qseero|PycURL|Pompos|oegp|SBIder|yoogliFetchAgent|yacy|webcollage|VYU2|voyager|updated|truwoGPS|StackRambler|Sqworm|silk|semanticdiscovery|ScoutJet|Nymesis|NetResearchServer|MVAClient|mogimogi|Mnogosearch|Arachmo|Accoona|holmes|htdig|ichiro|webis|LinkWalker|lwp-trivial|facebookexternalhit/i) && !userAgent.match(/phone|Playstation/i)) {
        // if user agent is a BOT/Crawler/Spider
        return 'bot';
    }

    // Otherwise assume it is a phone Device
    return 'phone';
};

