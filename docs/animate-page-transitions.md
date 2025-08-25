# YouTube Video Documentation
**Title:** Animate Page Navigation With Next.js & Motion(Framer-Motion)
**URL:** https://www.youtube.com/watch?v=7WXorRfTinY
**Duration:** 14m 42s
**Views:** 3632
**Channel:** tapaScript by Tapas Adhikary
**Upload Date:** 20250127
**Transcript Language:** en

## Description
👉 Don't forget to SUBSCRIBE: https://youtube.com/tapasadhikary
👉 Join as a Member:  https://www.youtube.com/channel/UCaYr5yxgOyk599Mnb3TGh-g/join
👉 Follow tapaScript GitHub: https://github.com/tapascript

Let us learn how to do Page level animation with Next.js and Motion(earlier known as Framer-Motion). The last video taught us how to use motion animation with Next.js Server components. Let us take the same project further to learn page-level animation or navigational animation.

Do not miss it.

Let's GO 🚀

I put much effort into providing you with the best quality content. Please SUBSCRIBE to the channel to show your support. Also, could you like/comment on this video so that it reaches others? 

Thanks! 🫶

Timecodes
0:00 - What Will We Learn?
01:11 - Animate Static Page Navigation
07:49 - Animate Dynamic Page Navigation
14:28 - Wrap Up

## Join tapaScript Discord
- Join Discord: https://discord.gg/YzUe4DbNAz

## Source Code on GitHub
- https://github.com/tapascript/nextjs-projects/tree/main/next-motion (Please give the repo a STAR if you find it helpful)
- Also Follow tapaScript on GitHub: https://github.com/tapascript

## Videos mentioned
- https://www.youtube.com/watch?v=g9Qe3zjVVDk
- https://www.youtube.com/watch?v=7yCVRMfjxh8
- https://www.youtube.com/watch?v=T90QUHosXIU

## 🤝 My Links:
- Blog: https://blog.greenroots.info/
- Follow on X(Twitter):  https://twitter.com/tapasadhikary
- Connect on LinkedIn: https://www.linkedin.com/in/tapasadhikary/  
- Follow My Work on GitHub: https://github.com/atapas
- Follow on Facebook:   https://www.facebook.com/tapasadhi

## 👋 Like my work? Thank You. You can sponsor me from here:
- Sponsor Me: https://github.com/sponsors/atapas
- Sponsor my Blog: https://blog.greenroots.info/sponsor

## About Me:
Tapas Adhikary is an Educator at tapaScript, Tech enthusiast, Writer, YouTuber, and Open Source projects maintainer/contributor. He is a full-stack developer with vast experience in building SaaS solutions. He is the founder of the ReactPlay platform, which is driven by open-source projects and a fast-growing community.

You can find more about him at https://tapasadhikary.com.

#nextjstutorial 
#next 
#nextjs15 
#animation
#framermotion
#motion
#nextjs 
#nextjs14 
#nextjsapprouter
#thinkinginnextjs
#nextjstutorial 
#prerendering
#designpatterns

## Transcript
[Music]
hey hello everyone this is tapas welcome
to your channel theas script in the last
video we have seen how to integrate
motion earlier it used to be known as
framer motion with nexj app router
nextjs 15 especially with the server
components we have seen some animations
like this where we could animate a
component also a page where we did the
scroll animation something that I loved
a lot and showed you how to do it in the
video now today what we going to do
we're going to accomplish something
called a page transition animation it
means that when you are going from one
page to another page how do you do
certain animation so that whenever you
enter to a page or exit from a page the
animation make the content looks
appealing and aesthetically much more
Rich so let's get started with that but
before we start as usual the request is
if you like this video post a like post
a comment tell me how did you feel about
it and of course subscribe because
without your subscription not much
motivation as we are talking about page
level animation we have just two pages
right now one is the homepage where that
square is rotating and there is another
page where I showed you the scroll
animation by the way if you have not
caught with that video please go ahead
and look into it that particular video
link is in the description of this video
it is important because you will have a
continuous learning then so what we're
going to do first we're going to build
couple of pages right now we'll build a
static page and the dynamic page and we
will show the transition for both the
pages let's go ahead and start creating
the static page first so for that under
app I'm going to create a new folder
called about because I'm going to create
an about page and inside that I'm going
to create something called a page.js
file so I have a page.js file the about
page can be very static page where we
can have a bunch of paragraphs listed so
let's have a component like this it's a
very simple component where I have a div
and bunch of P tags with LA msam so this
about page I can access from my browser
now with
slab that's great now next thing is let
us link this slab from this particular
page so that whenever we click on that
link to go to slab we can do certain
animation an entry animation for that
page go ahead and add a link so that's
inside block page.js file we already
have a link called Tapas script post
along with that let us add one more link
for about which connects to slab great
and we can basically put these two links
inside a div with a justify between so
that the first link appear at the left
side and the link comes to the right
side let's see in the UI we see this
this is the header and here is a link if
I click on about it will go to the about
page great now it's time that we start
adding that animation so in next case we
know the concept of layout in layout
things are pretty static whatever you
define with your page navigation when
you go from one route to another route
your layout is not going to reender so
it means that if you have created a
header created a footer or the sidebar
which are common across all the pages in
your application once you move from one
page to another page those header footer
sidebar are not going to rerender that's
fine but there is something else also
NEX provides which called template I
have created a video to show you what is
the difference between a layout and a
template with projects so if you have
not seen that video please go ahead and
take a look I have given the link to
that video in the description of this as
well so what template does unlike layout
whenever you do a transition from one
page to another page when you navigate
the template renders so it means that if
you define any state in that particular
template file the state will be again
reset if you have any animation in that
particular file that animation will be
rerun and that's how you get dynamicism
when you go from one route to another
route when you do the navigation change
using template the look and feel of a
layout and the template almost the same
so that's where most of the people get
confused and that's why I'm asking to
look into that video where we have drawn
that comparison so let's go ahead and
start writing a template and then start
putting the animation inside so that we
can see this page getting animated when
we navigating from one creating a
template is pretty easy wherever your
layout is there your page is there the
top level items let let me just collapse
all this over here under app directory
create a new file called template. JS
just like your layout template also
takes the children and this children
will be each of the pages on the same
route now over here just like a react
component you will be returning
something and this is the children means
the page so it means that this template
will now run for each of the navigation
on this particular route level this is
slash so it means that on slash apart
from running this layout XJ is also
going to run this template on top of it
so it means if I am putting a div around
this children that div will appear
around this page as well so with that
thought what I can do now is I can wrap
this page with a motion. div that's what
we have seen in the last video and the
motion come from motion SL react client
because we are talking about server
comom so let's go ahead and import
motion from motion react hyen client and
then wrap this guy with
motion. div and along with this we can
pass certain animation properties from
motion what we can do we can do a
transition of is in out again if you're
new to animations if you want a deeper
knowledge of how animation is done in
CSS I have created a course please go
ahead and look into that and then along
with that we'll use the initial property
and the animate property both the
properties we have seen in the previous
video the same thing we're going to use
over here as well so so first we are
going to use an initial property the
initially y20 opacity zero means nothing
I'm going to show from there I'm going
to animate it to opacity one y z at the
top so that means something will be
shown so before the page content will be
somewh below not shown and then when I'm
entering the page that time the content
will little bit come up from zero from
20 to Zer and it will be shown so that's
the animation that I'm planning and
while the transition happen let's put
some transition control as well that's
it I have to do nothing more than that
so let's go ahead and test it out so you
ready from this page I'm going to click
on the about and look at the transition
right now did you see that if I even
refresh you see see this so whenever I
am entering to this page from any other
page I am able to animate the content
using the template I could achieve this
animation again guys please look into
the layout versus template video because
I have captured a lot about template for
you to learn ground up okay so this is
fine now I'm going to do one more thing
but this time it's for dynamic route
this one was more of a static route
there is nothing Dynamic about it uh the
about page is very static but let's
build a dynamic route with blog right
now we have a Blog Page which list down
all my blog post now I can have a click
on each of the blog post as and when I
am clicking on them I can go to a new
blog Details page and when I'm going to
that blog Details page I want to animate
that content as well when I'm going from
a blog list page to the blog Details
page let's do that so for that let's
create the page first inside blog let's
create a new fold folder call ID because
we are going to deal with the dynamic
route now and the blog will be known by
blog
ID now inside that a page. GS file let's
call it a Blog Details page component
it's a simple react component but this
time we'll be accepting a params because
we have to get this ID dynamically from
the params we have seen that we have
learned about Dynamic routing from this
playlist itself as we are using next 15
there are certain things that are
changed in terms of handling this
parameter dynamically basically if you
want to extract out anything from this
param you have to do it asynchronously
that's the change that is made in nexs
15 while take you through the nexs 15
upgrade video I have mentioned that
already so we going to do something
similar from this so do const ID equals
to
aate params and from here you will be
extracting out the ID so I got the ID
right now
as I got the ID I'm going to use the
same API which we used last time with
Json placeholder typ code.com poost here
it will be slost slid that's it so let's
go back let's do a fetch
call with the fetch call I'm trying to
get the response same API but I'm just
passing the ID so that I can get the
details of that particular post now from
this I can get the post data all right
so I got the post data and then I can
return
let's assume that there is a component
called post details I'll be writing that
I could have done it in this component
itself but I always prefer writing
smaller component so that it's it's
easily manageable and reusable so I can
say post details post equals to this
post details data
excellent so that's my component I'll be
importing post details in a bit but let
us first create post details post
details is going to be a very simple
component under post new file post typ
in details. GSX the component is as
simple as this post details it takes the
post as a props and from there it just
shows the post content with a post. body
that's it and I'll go back to my page
and I'm going to
import post details from here that's it
and this post details is what I'm using
over here and last thing bending over
here is to export this component so my
blog details is ready now what we have
to do we have have list of post which
are here and clicking on each of them I
should go to the details of that post so
I have to do this connection and the
linking so let's go to post list this is
post list here I have each of the item
as this post list item so let's go to
post list item everything is over here
that's why they're having the scroll
animation so here I have to link I'll do
import link and then I have the post so
from post I can get the post ID let's
wrap this Dave with this link all right
so I have a link now hf2 /blog slost
doid so that if I click on each of those
item I can go to/ blog that particular
post ID and whenever I go to that
particular post ID through the dynamic
route this particular page will be
called this component will be called
I'll get the ID from the parameter then
I'll make the new call I'll get the post
data pass the post data to the post
details and everything should work let's
go back to UI and test all right time to
click on this guy I clicked on it wow I
get the post details but but but one
thing happened it didn't animate so when
I was going to AB out the animation was
there even when I go back to slash Blog
the animation was there there was
something that's coming up but if I go
over here the animation is missing why
because like layout template also works
based on the routing in our case the top
level layout is this layout. JS and for
this layout. JS we have this page.js
file and we also have this template but
when I have a dynamic route like this
blog and inside this ID and inside the
ID I have a page to have a template
impact you have to have a template. JS
here as well so what I'm going to do in
this case I'm just going to do a
copy and inside this ID I'm going to
past this guy same same template. JS no
changes you see over here same template.
JS file this particular routes Dynamic
route has its own template if we wanted
we could have had its own layout but for
our video and our learning for today we
don't need layout we are just interested
in getting the animation done so we have
the same template which is doing same
entry level animation so now let's go
back all right let's click on this
particular post and can see you saw that
now it's got animated so that's what we
wanted to do from the beginning of our
app everything seems to be animating
this is the landing page then from here
if I go to
blog this gets animated if I go to any
of the post this gets animated if I come
back the header also gets animated if I
go to about this also gets animated so
overall with motion or framer motion
that's what we used to call earlier we
have learned how to tackle component
label animation and the page label
animation you can really go farther
really go deep by understanding how the
motion works with all other animation
apis but to use it with next days be it
a client side component or a server side
component this is what you need to do
whatever we have showed in these two
videos the last one and this one is all
about tackling with server side
components we have not written a single
use client so guys if it was meaningful
to you please support me with like
comments and don't forget to subscribe
I'll be coming next very soon with
another informative video that's going
to help you in your development Journey
stay well keep learning

**Estimated Tokens:** 3836