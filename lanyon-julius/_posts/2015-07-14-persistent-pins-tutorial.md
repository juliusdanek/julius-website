---
layout: post
title: Swift Tutorial -  Persistent Annotations in MapKit with Core Data
published: true
category: coding
tags: coding iOS Swift CoreData MapKit 
comments: true
---

##Persistent Annotations in MapKit

Hi everyone, in this tutorial we will use CoreData to persist pin annotations on a map using Apple's MapKit in six simple steps. Basic familiarity with CoreData and iOS development is assumed. This tutorial was done for an iPhone 6 and iOS 8.

In Persistent-Pins we will drop pins on a mapView using the UILongPressGestureRecognizer. Dropped Pins will be immediately saved to a CoreData database. Pins can be deleted with taps. On restart, all placed Pins will have persisted on the map. My Github contains the finished project with comments, the steps can be found as commits. 

Github link to finished project: [https://github.com/juliusdanek/Persistent-Pins-Tutorial](https://github.com/juliusdanek/Persistent-Pins-Tutorial)

####Step one - Setting up our model and CoreData

Let's start by initializing the project. Create a new project in Xcode, starting from a single view application. Choose Swift as language and enable CoreData by ticking the "Use Core Data" box. 

![Start model picture](/assets/images/start-model.png)

Your project is now ready. Checkout how CoreData is initialized in the AppDelegate. 

Let's navigate to our model, "Persistent-Pins". This is where we are going to define our entity. Let's add one entity and name it "Pin". Add two attributes to your new "Pin" entity. "latitude" and "longitude" are both going to be attributes and will be of type "Double". We will store our Pin's latitude and longitude in these properties. 
####Step two - Setting up our managed object

Next, we are going to set up our managed object or entity. Navigate to your model "Persistent Pins" and go on "Editor". Select "create NSManaged Object subclass...". Choose Persistent Pins, then Pin, then change the language to Swift and save the file to your project folder (select the right group - persistent pins - in the group dropdown).

![pin attributes picture](/assets/images/pin-attribute.png)

At the top of the file, create another import statement for MapKit. We will need CoreData to save our Pins to our model and we will need MapKit to make the Pins that we save a subclass of MKAnnotation - this will allow us to populate our map with Pins directly from CoreData. 

Place an @objc(Pin) under your import statements to ensure compatibility with objective-c - see [http://stackoverflow.com/questions/24015185/generating-swift-models-from-core-data-entities](http://stackoverflow.com/questions/24015185/generating-swift-models-from-core-data-entities) for more details. 

You can see that "Pin" is already a subclass of NSManagedObject. Let's make it a subclass of MKAnnotation as well. We will now receive an error message that our Pin does not conform to the MKAnnotation protocol. Let's change that.

At the bottom of the class declaration, add the variable "coordinate" of class CLLocationCoordinate2D like so:

{% highlight swift %}
	var coordinate: CLLocationCoordinate2D {
	        return CLLocationCoordinate2D(latitude: latitude as Double, longitude: longitude as Double)
	    }
{% endhighlight %}

By now you will have noticed that latitude and longitude are declared as NSNumber. The problem is that CoreData will not recognize the Swift type **Double**. You will simply have to convert between Doubles and NSNumbers. 

Let's provide our custom init method in the next step. Add this code below where you define your @NSManaged vars.

{% highlight swift %}
    override init(entity: NSEntityDescription, insertIntoManagedObjectContext context: NSManagedObjectContext?) {
        super.init(entity: entity, insertIntoManagedObjectContext: context)
    }
    
    init(annotationLatitude: Double, annotationLongitude: Double, context: NSManagedObjectContext) {
        
        let entity = NSEntityDescription.entityForName("Pin", inManagedObjectContext: context)!
        
        super.init(entity: entity, insertIntoManagedObjectContext: context)
        
        latitude = NSNumber(double: annotationLatitude)
        
        longitude = NSNumber(double: annotationLongitude)
    }
{% endhighlight %}

Our custom init method allows us to find our entity and initialize a Pin CoreData entry with our custom latitude and longitude values. This initializer will also automatically generate your coordinate. 

**Finally, navigate to your model and change the class in your Pin entity to "Pin"**

![pin class picture](/assets/images/pin-class.png)

Great, we are finished creating our custom object and are done with step one. This should be the finished code:

{% highlight swift %}
	import Foundation
	import CoreData
	import MapKit

	class Pin: NSManagedObject, MKAnnotation {

	    @NSManaged var latitude: NSNumber
	    @NSManaged var longitude: NSNumber
	    
	    override init(entity: NSEntityDescription, insertIntoManagedObjectContext context: NSManagedObjectContext?) {
	        super.init(entity: entity, insertIntoManagedObjectContext: context)
	    }
	    
	    init(annotationLatitude: Double, annotationLongitude: Double, context: NSManagedObjectContext) {
	        let entity = NSEntityDescription.entityForName("Pin", inManagedObjectContext: context)!
	        super.init(entity: entity, insertIntoManagedObjectContext: context)
	        latitude = NSNumber(double: annotationLatitude)
	        longitude = NSNumber(double: annotationLongitude)
	    }
	    
	    var coordinate: CLLocationCoordinate2D {
	        return CLLocationCoordinate2D(latitude: latitude as Double, longitude: longitude as Double)
	    }

	}
{% endhighlight %}

####Step three -- setting up our UI and our ViewController

Navigate to storyboard and drag a MapKit View onto your viewcontroller. Set the constraints so the MapView fills out the entire controller. Also, do not forget to enable MapKit in your projects capabilities. Go to persistent Pins and enable "Maps" under capabilities. 

![mapkit picture](/assets/images/turnon-mapkit.png)

Let's create an outlet for our mapView in our ViewController file. ctrl + drag your mapView into your ViewController using the assistant editor and add an outlet named "mapView". Do not forget to import MapKit into your ViewController and set your ViewController as MKMapViewDelegate. 

In our viewDidLoad method, let's add a long pressure gesture recognizer that will allow us to drop pins. 

Your ViewController should look like this now:

{% highlight swift %}
	import UIKit
	import MapKit

	class ViewController: UIViewController, MKMapViewDelegate {

	    @IBOutlet weak var mapView: MKMapView!
	    
	    override func viewDidLoad() {
	        super.viewDidLoad()
	        
	        var longPress = UILongPressGestureRecognizer(target: self, action: "dropPin:")
	        longPress.minimumPressDuration = 0.5
	        mapView.addGestureRecognizer(longPress)
	        
	        mapView.delegate = self
	        
	    }
	}
{% endhighlight %}

As you can see, the UILongPressGestureRecognizer us linked to a method called dropPin. We will implement that method next.

####Step four - the dropPin method

Let's define our dropPin method. We will have to do three things:

1. Extract the coordinates from the point where the user touched
2. Add an annotation when the UIGestureRecognizerState fires
3. Save that annotation to CoreData

Let's start by defining the function and extracting location data:

{% highlight swift %}
	func dropPin(gestureRecognizer: UIGestureRecognizer) {
	        
	        let tapPoint: CGPoint = gestureRecognizer.locationInView(mapView)
	        let touchMapCoordinate: CLLocationCoordinate2D = mapView.convertPoint(tapPoint, toCoordinateFromView: mapView)
	    }
{% endhighlight %}

Now, this method does not really do much yet. Let's add a pin!

{% highlight swift %}
    func dropPin(gestureRecognizer: UIGestureRecognizer) {
        
        let tapPoint: CGPoint = gestureRecognizer.locationInView(mapView)
        let touchMapCoordinate: CLLocationCoordinate2D = mapView.convertPoint(tapPoint, toCoordinateFromView: mapView)
        
        if UIGestureRecognizerState.Began == gestureRecognizer.state {
            let pin = MKPointAnnotation()
            pin.coordinate = touchMapCoordinate
            mapView.addAnnotation(pin)           
        }
    }
{% endhighlight %}

Now we can see pins dropping where we touched. This implementation is fairly straightforward. Our pins are not persistent yet though! Let's change our dropPin function with this code:

{% highlight swift %}
    func dropPin(gestureRecognizer: UIGestureRecognizer) {
        
        let tapPoint: CGPoint = gestureRecognizer.locationInView(mapView)
        let touchMapCoordinate: CLLocationCoordinate2D = mapView.convertPoint(tapPoint, toCoordinateFromView: mapView)
        
        if UIGestureRecognizerState.Began == gestureRecognizer.state {
            let appDelegate = UIApplication.sharedApplication().delegate as! AppDelegate
            
            let pin = Pin(annotationLatitude: touchMapCoordinate.latitude, annotationLongitude: touchMapCoordinate.longitude, context: appDelegate.managedObjectContext!)
            mapView.addAnnotation(pin)
            appDelegate.saveContext()
        }
    }
{% endhighlight %}

We will instantiate the appDelegate so we can use its methods. Then we proceed to instantiate a pin as our Pin class. We will initialize it with the coordinates from our touchMapCoordinate and use the appDelegate context as our context. Then we add the pin to our map view and we save our context - we could do this at another point too but it seems smart to do it here. We just successfully added a Pin to our CoreData model!

####Step five - fetching our Pins and adding them to our map when starting our app

Alright, let's make sure that the pins that we insert into CoreData also get fetched when we need them, i.e. when the mapView loads. Let's first change some of the logic that we implemented before. Import CoreData to our ViewController. Let's also declare two implicitly unwrapped variables in ViewController:

{% highlight swift %}
    var appDelegate: AppDelegate!
    var sharedContext: NSManagedObjectContext!
{% endhighlight %}

Next, in our viewDidLoad method, at the very top, initialize the two new variables as so:

{% highlight swift %}
        appDelegate = UIApplication.sharedApplication().delegate as! AppDelegate
        sharedContext = appDelegate.managedObjectContext
{% endhighlight %}

this allows us to access our NSManagedObjectContext and our saveContext() method throughout the ViewController. 
Do not forget to adjust the dropPin method accordingly! Delete the declaration of appDelegate that we had before and use the sharedContext variable in our init method. 

Alright, let's create a method for a fetchrequest! Simply use this code:

{% highlight swift %}
    func fetchAllPins() -> [Pin] {
        let error: NSErrorPointer = nil
        let fetchRequest = NSFetchRequest(entityName: "Pin")
        let results = sharedContext.executeFetchRequest(fetchRequest, error: error)
        if error != nil {
            println("Error in fectchAllActors(): \(error)")
        }
        return results as! [Pin]
    }
{% endhighlight %}

We create a fetchrequest, then execute it. In case there are any errors, we print the error to the console. The results are then returned as an array of pins. Now that we have a method can allows us to access our Pins as an array, let's put them on the map! At the bottom of our viewDidLoad method, add the following code:

{% highlight swift %}
    mapView.addAnnotations(fetchAllPins())
{% endhighlight %}

Great, now we are able to see the pins that we add. Let's try it out. 

####Step six - deleting pins

This step is remarkably easy. We will implement one of our delegate methods - didSelectAnnotation. The wonderful thing is that all mapView.annotations are saved as an array - an array of Pins! That means the selected annotation can always be casted as a Pin and deleted from the managed context. The method should look like this:

{% highlight swift %}
    func mapView(mapView: MKMapView!, didSelectAnnotationView view: MKAnnotationView!) {
        let pin = view.annotation as! Pin
        sharedContext.deleteObject(pin)
        mapView.removeAnnotation(pin)
        appDelegate.saveContext()
    }
{% endhighlight %}

That was our last method! Our viewController should now look like this:

{% highlight swift %}
import CoreData
import UIKit
import MapKit

class ViewController: UIViewController, MKMapViewDelegate {

    @IBOutlet weak var mapView: MKMapView!
    
    var appDelegate: AppDelegate!
    var sharedContext: NSManagedObjectContext!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        appDelegate = UIApplication.sharedApplication().delegate as! AppDelegate
        
        sharedContext = appDelegate.managedObjectContext
        
        var longPress = UILongPressGestureRecognizer(target: self, action: "dropPin:")
        longPress.minimumPressDuration = 0.5
        mapView.addGestureRecognizer(longPress)
        
        mapView.delegate = self
        
        mapView.addAnnotations(fetchAllPins())
    }
    
    func dropPin(gestureRecognizer: UIGestureRecognizer) {
        
        let tapPoint: CGPoint = gestureRecognizer.locationInView(mapView)
        let touchMapCoordinate: CLLocationCoordinate2D = mapView.convertPoint(tapPoint, toCoordinateFromView: mapView)
        
        if UIGestureRecognizerState.Began == gestureRecognizer.state {
            let pin = Pin(annotationLatitude: touchMapCoordinate.latitude, annotationLongitude: touchMapCoordinate.longitude, context: appDelegate.managedObjectContext!)
            mapView.addAnnotation(pin)
            appDelegate.saveContext()
        }
    }
    
    func mapView(mapView: MKMapView!, didSelectAnnotationView view: MKAnnotationView!) {
        let pin = view.annotation as! Pin
        sharedContext.deleteObject(pin)
        mapView.removeAnnotation(pin)
        appDelegate.saveContext()
    }
    
    
    func fetchAllPins() -> [Pin] {
        
        let error: NSErrorPointer = nil
        let fetchRequest = NSFetchRequest(entityName: "Pin")
        let results = sharedContext.executeFetchRequest(fetchRequest, error: error)
        if error != nil {
            println("Error in fectchAllActors(): \(error)")
        }
        return results as! [Pin]
    }
}
{% endhighlight %}

Tada! We are finished. Additional modification could include: Adding data like photos to a Pin, and defining a relationship between a Photo and the Pin object, using NSFetchResultsController to get results and update UI, modifying appearance of the Pins, displaying user location on map, etc. 

I hope you enjoyed this tutorial! 

