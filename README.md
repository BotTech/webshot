# webshot

Takes a screenshot of a webpage including any pesky iframes with cross origin content.

## Installation

```shell
npm install -g webshot
```

> ℹ️
>
> Or you can use it without installing:
>
> ```shell
> npx webshot
> ```

## Usage

```shell
webshot https://example.com`
```

Or

```shell
npx webshot https://example.com`
```

## Options

* `-o, --output <path>`: Output file path (default: `screeshot.png`).
* `-w, --width <number>`: Viewport width (default: `1920`).
* `-h, --height <number>`: Viewport height (default: `1080).
* `-c, --config <path>`: Path to a config file.

## Config

The config file is a JSON file that contains the following options:

* `blacklist`: An array of objects with the following properties:
	+ `domain`: The domain to blacklist. Will match all subdomains.
	+ `path`: The path prefix to blacklist (optional).
* `outputPath`: The file path to save the screenshot.
* `viewport`: An object with the [Viewport] properties including:
	+ `width`: The width of the viewport.
	+ `height`: The height of the viewport.
* `launch`: An object with the [Launch] properties including:
	+ `width`: The width of the viewport.
	+ `height`: The height of the viewport.


[Launch]: https://pptr.dev/api/puppeteer.puppeteerlaunchoptions
[Viewport]: https://pptr.dev/api/puppeteer.viewport