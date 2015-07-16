---
layout: post
title: Useful Swift Shorthand Notations
published: true
category: coding
tags: swift coding
comments: true
---

While studying Swift I sometimes come across shorthand notation that can be extremely confusing at first. You don't know the name of the particular shorthand and don't know where to look it up at first but when you get the gist of it, it can be extremely useful. I will list a few here that I found to be interesting as I have not encountered them in other languages before. 

## Terniary

A great example is the [terniary](https://developer.apple.com/library/ios/documentation/Swift/Conceptual/Swift_Programming_Language/BasicOperators.html)(look under "Terniary Conditional Operator"). A terniary can look something like this:

{% highlight swift %}

let b: CGFloat = self.blueControl.on ? 1 : 0

{% endhighlight %}

Pseudo-code:

> If self.blueControl is on (self.blueControl is a on/off switch), assign b a CGFloat with the value of 1. If it isn't, assign the value of 0. 

In code, this is shorthand notation for:

{% highlight swift %}

if self.blueControl.on {
  let b: CGFloat = 1
} else {
  let b: CGFloat = 0
}

{% endhighlight %}

Here's another example that illustrates the use of terniaries

{% highlight swift %}

if 2 > 4 {
    let a: Int = 1
} else {
    let a: Int = 0
}

let a: Int = (2 > 4) ? 1 : 0

{% endhighlight %}

## Assigning bools

In another persons' code I encountered this interesting notation:

{% highlight swift %}

youWon = opponentChoice == "Paper"

{% endhighlight %}

Pseudo-code:

> If opponentChoice equals string "Paper", assign youWon the boolean value of true.

or:

{% highlight swift %}

if opponentChoice == "Paper" {
  youWon = true
} else {
  youWon = false
}

{% endhighlight %}

I will update this as I find new shorthand notations!

