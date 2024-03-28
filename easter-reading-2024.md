# 📄 Some light easter reading on the topic of tests, coverage and quality 🐣 

During my off time for the last week or so, I've had a deep dive into a very small side 
project. You've read about it in #random, and it's a command line app made in Node.

The conversation about the project triggered a motivation to spend some extra time to explore 
and exercise my skills in unit testing with modern Node, including Vitest, coverage 
measurement and CI with Github Actions - all of which would be relevant skills to take with 
me to work. Apart from the technical learnings, I happened to create a good demonstration for 
the topic of code coverage, and what we can and should expect from coverage as a metric. If 
you'd like to follow along with my examples, please have a look at [github.com/kirayatail/todo](https://github.com/kirayatail/todo).

### First discovery, useful tests and actually catching bugs

The app itself is so small that MVP and feature complete differs by about... 10 lines of 
functional code? I was basically done when I deployed the first test-free version, started 
the conversation in #random and actually made use of the program for myself. I had defined 
the feature outline of the project to be so simple that grasping the full functionality and 
even describing it in one sentence was easy. "Use a command line interface to treat a text 
file as a stack where you can push items on top, pull items off the top, and quickly remind 
yourself what's on top at any time". 

Automating tests to cover forgotten edge cases or scoping the application in different ways 
seems unnecessary and any developer would figure out what the code is doing in no time. For 
clarity, I had already split the logic and UI (defining the shell commands) in separate parts 
as good practice suggests, so the cognitive load should not be an issue. Application logic is 
about 70 lines of code, should be bug free just by looking at it, right? Wrong. It won't show 
in the code since I caught it before making the first commit, but here's some example 
output:

```
> todo list
First task
Second task
Third task
> todo push --next new task to do next
First task
new task to do next
Second task, Third task
```

and the file I'm talking about: [todo.js@first commit](https://github.com/kirayatail/todo/commit/9c40a97f9fcc51ad9ef4a39f0fb39e21b0292ec3#diff-ace925ac48f91c9439187a9ba10fb1e60aebad19e14519a42d745d14d0651438)

Aha! A perfect situation to introduce unit tests to harden expected feature behavior, catch 
similar issues and verbalize the requirements. Based on the actual **requirements** I have 
for each feature, I eject and mock the file handling, and create tests to cover all the 
functions in the file. The outline of the test suite reveals that there are typically 2-3 
positive requirements per function, usually based on changed circumstances when each function 
is called. 

```
   ✓ Todo functions (13)
     ✓ Show/List (4)
       ✓ Show prints even on empty list
       ✓ Show prints first item
       ✓ List prints even on empty list
       ✓ List prints all items
     ✓ Push/Cue (3)
       ✓ Regular push, new item first and printed
       ✓ Placing item next in line
       ✓ Placing item next last in list
     ✓ Pop (3)
       ✓ Pop with more items in list
       ✓ Pop with one item in list
       ✓ Pop with no items in list
     ✓ Edit (2)
       ✓ Edit without editor set
       ✓ Edit with editor set
```

I see and recognize this all the time where the customer/stakeholder/project manager defines 
a feature with a single flow, like "Pop should remove the top item from the list". It's not 
even about defining negative behaviors (like what the feature should not do, what kind of 
errors it throws, etc.), just expanding the requirement set to cover positive functionality 
in more situational circumstances goes a long way when trying to avoid bugs already on the 
planning stage...

But I digress, refinement is a topic for another day.

The test file, which I consider as super relevant in catching bugs related to my 
requirements, is roughly 180 lines of code. ([todo.test.js](https://github.com/kirayatail/todo/blob/main/tests/todo.test.js)) Functions that this file is testing are descibed 
in 60 lines of code. It's time well spent to avoid foreseeable bugs, but also indicative of 
what the cost of software quality is.

### Second discovery, chasing coverage

At this point, what could be considered _my_ code is fully tested. To generate all the CLI 
functionality (creating commands with hints, options, arguments and help texts), I'm using a 
fully featured NPM package, where a simple chain of function calls will create a command and 
attach a function to it. From a developer's perspective, this is little more than painting 
boxes and arranging them next to each other. About zero-point-five logical complexity, and we 
can compare it to defining the structure of a document, HTML - which looks like a lot of 
complex code, but actually isn't (complex, that is).

This is where I install and run the coverage tools, which show me the sad but accurate 
reality: Even though 100% of todo.js is covered, the total for the project is about 43%. If 
you're a project manager and reading this, please take a moment and think of what your 
directive would be. Is this good enough or can we do better? Meanwhile, I'll remind myself of 
one of the messages in the Slack thread:

> What's the test coverage on this??? [...]

I think that the literal question may not really reflect the underlying message, or at least 
I hope so. The more healthy question would probably be "Are you covering all features with 
automated tests?". The big difference would in my case be 100% - 43% according to what I just 
mentioned, and that's quite a lot. My motivation is slowly transforming into an obsession to 
chase the elusive 100%, and being able to add the ultimate proof of bragging rights to the 
Github Readme:

[![Coverage Status](https://coveralls.io/repos/github/kirayatail/todo/badge.svg?branch=main)](https://coveralls.io/github/kirayatail/todo?branch=main)

In terms of development, it means a bit more research on best practices on testing usage of 
the CommanderJS package, some restructuring and isolating commander code in a file that I can 
test. The tests themselves are very straightforward, it's basically "Run a command, check 
that the corresponding function was called" all the way. Commander provides all logic for 
handling options and arguments, the only extra logic is a function that bunches arguments 
together into a single string. Files to look at: 
[command.js](https://github.com/kirayatail/todo/blob/main/src/command.js) & 
[command.test.js](https://github.com/kirayatail/todo/blob/main/tests/command.test.js).

The project silhouette has changed to a set of well isolated modules with super clear separation of concern. Due to limitations in testing and mocking the new ESM dependency system, I had to remap an external package. This means that the total amount of untested JS code is the following:

```
(src/open.js)
import Open from 'open';
export const open = Open;

-----
(index.js)
#!/usr/bin/env node
import { program } from './src/command.js';
program.parse();
```

This is also typical. The mapping file is not much to mention, but the index is practically 
the bootstrapper of the application, the main entry point as compared to the test files that 
also work as entry points, but replace all dependencies with mocked functions. Out of 125 
lines of code, 120 are tested, and I believe that's the best I'm gonna get.

### Third discovery, value and effort

By my estimates, I've spent my time on this project as follows:

```
20% Writing the actual program
30% Testing todo.js
50% Refactoring, testing the rest and 
    getting that coverage badge
```

Let's pretend you're the project manager again and would spend an equal distribution of money 
to get the corresponding value. Was it actually worth it?

There is in my opinion two major ways to look at it. Number one comes with the assumptions 
that the feature set is small enough to fully understand in one thought, and that the 
original idea is 100% valid and covers the end product throughout its whole lifespan - in 
other words, it's never gonna change or improve beyond the original thought. Those 
assumptions could very well be valid for this project, it had all the indications of being 
small and "done" before it was even written. I argue that automated testing is a waste* of 
effort for this kind of product. I could argue that the only reason I spent 80% of project 
time on testing was because I was bullied into doing it**. The circumstances in this case do 
however open up for employing Test Driven Development as a method, since the functional 
requirements should be much easier to articulate long before any code is written. Writing 
tests should be easier compared to the second case.

(* no functional value over time. ** That's of course not the case, I'm using the 80% to 
learn a lot and share it with you)

Number two means that the assumptions are not true, and automated tests will fulfill this set of values: 

* Verifying functionality in partial scopes - the product is too large for a single person to 
keep everything in mind, and keeping tests on file serves as extended memory for functional 
decisions.
* Tracking changing decisions over time - when requirements change, full test coverage (in 
relation to requirements) will assure that the changes are properly described and the 
behavior is verified.
* Test writing encourages modularization - code is separated by concern to a degree which 
makes partial scopes easier to identify, and the cognitive load should in theory be easier.

My verdict, with this project as a demo, is that Option one means do the 20% of dev work and 
be done. Option two means do 20% dev work + 30% requirement based testing. You can safely 
assume that popular, well maintained libraries and frameworks are verified against their 
respective sets of requirements, so you don't have to. Any directives about code coverage 
reaching a certain percentage are essentially useless, in this project, more than half of the 
code on a statement level, is just structure, content and metadata. What that number is gonna 
be for any other project is not for me to predict.

I hear that testing is hard, and I agree. Sometimes, technical aspects like platform, 
architecture and dependency structure will force us into a corner where no mocks can save us, 
but for the most part, I think that "testing is hard" = "defining requirements is hard". Most 
of the time, testing is just about verifying behavior, and figuring out what that behavior is 
gonna be, is the tricky part. As a developer, I have insight into in what way behavior has to 
be defined in order for it to execute on a machine, and part of my work should be to assist 
stakeholders in defining behavior. Preferably, half the time I can spend contributing to 
defining ideas in early discovery and refinement work, will save me twice the effort trying 
to figure out all cases and circumstances in late-stage refinement, and the tests will more 
or less write themselves as a cherry on top.