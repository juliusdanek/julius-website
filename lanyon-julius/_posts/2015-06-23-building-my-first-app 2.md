---
layout: post
title: Building my first iPhone apps
published: true
category: coding
tags: coding iOS UIKit Swift
comments: true
---

Over the past two weeks I have been following the udacity.com [nanodegree for the Swift programming language](https://www.udacity.com/course/ios-developer-nanodegree--nd003). What started off fairly slow with an introductory course to Swift and a first project, building an app that modified your voice when recording, continued with an extremely steep learning curve for the next project - a meme creator application. 

In this app, the user would be able to take choose an image or take one with his/her camera and amend "meme-style" text to it. Then the user would be able to save or share the created memes and look at all the created memes in a table. What sounds very easy was actually quite challenging as it involved several important concepts that needed to be applied in order for the application to function:

* Understanding the use of UIKit
* Using NSNotifiction Center
* Resizing images
* Accessing the camera roll and the photo library
* Using navigation controller
* Using the tab controller
* Pushing viewcontrollers modally and through different methods
* Setting up table and collection views
* NSDate

I started out by setting up a tabbed application in Xcode. The picture shows how my storyboard is set up. For those of you that do not know, the storyboard connects all the visual element of an iOS application. You connect those visual elements to the code behind the app. The code controls the visual elements as well as the data behind an application. This interaction is called the MVC - model view controller. The model is the data, the view are the visual elements and the controller connects the two as well controlling the visual output depending on the data. For more info check out: [http://blog.codinghorror.com/understanding-model-view-controller/](http://blog.codinghorror.com/understanding-model-view-controller/).

Check out the storyboard for my application. The tab view controller is first. When pressing the button on the top right you navigate to the meme editor. From there, an interaction with the "share" button will bring up the activity controller. Any interaction with that controller will add the meme to the data model and will get displayed in the table view that was also the starting point in the app. When you select a meme in the table view (or the collection view which can be selected in the beginning of the app) you get shown a detail view that allows to edit the meme or delete it. 

![Meme-Me app picture](/assets/images/meme-storyboard.png)

This is the starting point of the app. On the top right you are able to open the meme editor and start editing memes. The view is split into a table view and a collection view, accessible through the tab bar on the bottom. Since the table and collection are not populated with data yet (the user hasn't created any memes), they are both hidden and a label is displayed instead that tells the user to add a meme first. As you can see, the editing button on the top left is disabled as well.

![Meme-me table view](/assets/images/meme-empty-table.jpg)

When the "add" button is touched up, the meme-editor pushes up modally (meaning that it is its own contained view, coming up from the bottom, as opposed to navigating deeper into the application to the right, like for example in the settings app on your iPhone). Here you are able to select an image from your camera roll or take one yourself. The image then gets fit into an imageview surrounded by two textfields. These textfields have been modified with custom properties. When you edit the bottom text field, the entire bottom view pushes up. This piece of code was actually quite some work as the viewcontroller has to subscribe to notifications when the keyboard would shift up or down. Once these notifications "arrive", the screen can be shifted up by the height of the keyboard. After subscribing to notifications, you need to unsubscribe when exiting the view and you also need to implement a function to shift the view back down when the keyboard hides. Code snippet below:

{% highlight swift %}
	//subscribing to notifications -> This function gets called before the view appears
    func subscribeToKeyboardNotifications() {
        NSNotificationCenter.defaultCenter().addObserver(self, selector: "keyboardWillShow:"    , name: UIKeyboardWillShowNotification, object: nil)
        NSNotificationCenter.defaultCenter().addObserver(self, selector: "keyboardWillDisappear:", name: UIKeyboardWillHideNotification, object: nil)
    }
    
    //finding out keyboard height in pixels
    func getKeyboardHeight(notification: NSNotification) -> CGFloat {
        let userInfo = notification.userInfo
        let keyboardSize = userInfo![UIKeyboardFrameEndUserInfoKey] as! NSValue // of CGRect
        return keyboardSize.CGRectValue().height
    }
    
    //what to do when the keyboard shifts up, conditional on the bottom text field being edited. Subtract the keyboard height from the frame origin, so it shifts up
    func keyboardWillShow(notification: NSNotification) {
        println("showing Keyboard")
        if bottomField.isFirstResponder() {
            self.view.frame.origin.y =  -getKeyboardHeight(notification)
        }
    }
    
{% endhighlight %}

![Meme Editor](/assets/images/meme-editor.jpg)

After the meme is ready, the user can take touch up the share button on the top left, which brings up an activity controller. The activity controller receives a snapshot of the created image and allows the user to share or save it. Any action except cancel will exit the meme-editor and add the image to the saved memes. Saved memes actually is an array in the app delegate, storing all the memes (apparently this is bad practice but I will learn about different ways of storing data soon). For this purpose I created a custom class Meme that stores the memes original images, the bottom and top text, the memedImage and the date and time created. 

![Meme Activity Controller](/assets/images/meme-activity.jpg)

After choosing an activity, the meme-editor will get exited and we can see the table view populated with the meme that we just created. The edit button allows us to delete the meme. The date created, the top text and the memedImage are displayed in a table cell. Every time the view loads, the table gets updated and re-populated. When touch up on the meme, a detail view pulls up that allows you to see the meme in full detail as well as deleting or editing it. Editing will pull up the meme editor and pass the information stored in the meme struct (topText, bottomText, original image) to the editor, allowing you to start off with the original meme. 

![Meme Table Populated](/assets/images/meme-table-full.jpg "Populated Table")

Concluding, I am very satisfied with my progress. The app looks pretty sleek. I still have some issues understanding the whole navigation controller concept and with some of the layout stuff but overall I have a pretty good idea how the MVC concept works and how data gets passed around through the app. I am excited about my next projects. 


![Meme Detail Delete](/assets/images/meme-detail.jpg "Detail View")
