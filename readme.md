# vite-plugin-webarchive

A vite plugin to generate a Safari [`.webarchive`](<https://en.wikipedia.org/wiki/Web_Archive_(file_format)>) file containing your build output.

## Why?

If you're asking, you don't need this. I made it specifically as part of an experiment with improving workflows around webviews in iOS native apps: you can include this `.webarchive` in your app bundle then load it directly in the webview.

## Notes

The Web Archive format is not really any kind of official format, nor is it well documented anywhere. It's just a renamed Darwin Property List, or `.plist` file. If you change the extension to `.plist` and open it in XCode you'll see its entries, like `WebMainResource` and `WebSubresources`.

Within `WebSubresources` you'll see that each resource contains a `WebResourceResponse` entry with raw data, that's actually an `NSHTTPURLResponse` passed through `NSKeyedArchiver`. A useful writeup of how that data looks like is here:

https://www.mac4n6.com/blog/2016/1/1/manual-analysis-of-nskeyedarchiver-formatted-plist-files-a-review-of-the-new-os-x-1011-recent-items

Rather than use Apple-specific APIs (and thus stop this plugin working on other platforms) this plugin reverse engineers the serialized result from an example I generated with Safari.
