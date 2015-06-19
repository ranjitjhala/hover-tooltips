# Hover-Tooltips

This is a simple package to implement & experiment with
mouseover-identifier tooltips in the amazing [Atom](http://atom.io) editor!

![A screenshot of your package](https://f.cloud.github.com/assets/69169/2290250/c35d867a-a017-11e3-86be-cd7c5bf3ff9b.gif)

## TODO

+ refactor 'hover-tooltips' so that it is a class whose constructor
  takes an implementation of 'Info' as input?

+ hover-tooltips-dummy     = new HoverTooltips(DummyInfo)
+ hover-tooltips-hdevtools = new HoverTooltips(HdevtoolsInfo)
+ hover-tooltips-liquid    = new HoverTooltips(LiquidInfo)

 
+ plug into `hdevtools` (harder, requires 'process' calls)
+ plug into `liquid`

## Usage

To get hover-tooltips for your favorite language, edit `lib/getInfo.ts`
to fill in suitable implementations for:

+ `isHoverExt`
+ `getHoverInfo`

## Inspirations

+ ![ide-haskell](http://atom-haskell.github.io/ide-haskell)
+ ![atom-typescript](https://github.com/TypeStrong/atom-typescript)
