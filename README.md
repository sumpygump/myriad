# Myriad

Unix timestamps for humans.

This is an experiment in reading unix timestamps (number of seconds since the
Epoch). The idea is to break it up into something that is useful to think about
throughout the day.

Take a unix timestamp, say 1669041854, and take note of how often each decimal
place in the number will change. For example, the first number in the 1 billons
place will change every 31.7 years.

```
  0    1    2    3    4    5    6    7    8    9 
[ 1 ][ 6 ][ 6 ][ 9 ][ 0 ][ 4 ][ 1 ][ 8 ][ 5 ][ 4 ]
  |    |    |    |    |    |    |    |    |    |
  |    |    |    |    |    |    |    |    |    └─ 1 second
  |    |    |    |    |    |    |    |    └─ 10 seconds
  |    |    |    |    |    |    |    └─  1.6 minutes
  |    |    |    |    |    |    └─ 16.6 minutes
  |    |    |    |    |    └─ 2.8 hours
  |    |    |    |    └─ 1.1 days
  |    |    |    └─ 11.6 days
  |    |    └─ 115.7 days (about on third of a year)
  │    └─ 3.7 years
  └─ 31.7 years
```

Some notable facts about each of these large number of seconds:

- 1 billion seconds (1 gigasecond) = 31 years 251 days 13 hours 21 minutes 28 seconds
- 100 million seconds = 3 years 61 days 16 hours 19 minutes 4 seconds
- 10 million seconds = 115 days 17 hours 46 minutes 40 seconds
- 1 million seconds (1 megasecond) = 11 days 13 hours 46 minutes 40 seconds
- 100 thousand seconds = 1 day 3 hours 46 minutes 40 seconds
- 10 thousand seconds = 2 hours 46 minutes 40 seconds

## The myriad time

I have determined the first six numbers are useful for breaking up the day into
2.8 hour chunks.

That is what I call a myriad. Myriad means 10,000, and so if you divide the
unix timestamp by 10,000 you get the current timestamp in myriads.

Viewing it as a myriad, you can look at the timestamp like this: 144904.1854,
and it is easier for your brain to see the numbers.

## Usage

I wrote this python script to produce me the current myriad time and notable
timestamps throughout the day.

`./myriad` by itself produces the current myriad time: `166912.8917`

Executing `./myriad --checkpoints` will show some useful myriads for the current day

```
☾ 166909.6800 2022-11-22 00:00:00
  166910.0000 2022-11-22 00:53:20
  166911.0000 2022-11-22 03:40:00
  166912.0000 2022-11-22 06:26:40
▶ 166912.8917 2022-11-22 08:55:17
  166913.0000 2022-11-22 09:13:20
☼ 166914.0000 2022-11-22 12:00:00
  166915.0000 2022-11-22 14:46:40
  166916.0000 2022-11-22 17:33:20
  166917.0000 2022-11-22 20:20:00
  166918.0000 2022-11-22 23:06:40
  166919.0000 2022-11-23 01:53:20
```

It lists the myriad time at midnight, noon, the current time and then for each
major myriad until the next day.
