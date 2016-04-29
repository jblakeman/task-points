My ToDo
====

Use game-theory based positive reinforcement as motivation to accomplish things

User Stories
----

* A User can view a list of tasks
* " "    "   create, view, update or delete a task or sub task
* Specify an enjoyment level to a task
* "       "  estimated completion time " " "
* Tag with a category

Task Properties
----

    1.  Body
    2.  Estimated completion time
    3.  Points
    4.  Sub-task List (optional)
    5.  Enjoyment level
    6.  Tag (category)

###Body###

A short description of the task at hand

###Estimated Completion Time###

Amount of time, taken from input of a clock field. e.g. 00:45 --> 45 minutes

###Enjoyment Level###

Can be one of ['low', 'medium', 'high']

###Tag###

Any task can have as many tags as the user assigns to it.

If a user assigns a tag to a task that has Sub-tasks, all Sub-task children are
assigned that tag.  Sub-tasks, however, may contain tags that parents do not.

###Points###

Auto-assigned based on Estimated Completion Time and Enjoyment Level

Each task has a base formula of (enjoyment level * (1 + (number of minutes * .5))

If a task contains a Sub-task List, a bonus is added for completing all tasks.

Bonus point formula: ((number of Sub-tasks * 1.75) + (1.15 * (point total of Sub-tasks * .25)))

###Sub-task List###

A Sub-task has all the same properties of a task, the only difference being
it belongs to (child) another task or Sub-task.

For each Sub-task List, when a user marks all the the tasks complete, the parent
task is awarded a point total.

Stats
----

Graphs of completion rates over time can be viewed.

User can select the 0 value of the X axis for date from a list of options:

    ['week', 'month', 'year', 'beginning of time']

Notes
----

This is the initial planning state, all of this content is subject to change
