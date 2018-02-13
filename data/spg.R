setwd('/Users/lindsaycarbonell/Documents/REPOS/restart-schools/data/')

library(dplyr)
library(ggplot2)
library(svglite)
library(gdtools)
library(gridExtra)
library(ggthemes)

spg = read.csv('spg_all.csv', header = T)
district_codes = unique(substring(spg$school_code,1,3))
district_names = unique(spg$lea_name)

spg_alamance <- spg %>%
  filter(substring(school_code,1,3)=="010")

spg_wake <- spg %>%
  filter(substring(school_code,1,3)=="920")

spg_edgecombe <- spg %>%
  filter(substring(school_code,1,3)=="330")

spg_washington <- spg %>%
  filter(substring(school_code,1,3)=="940")

print(spg_alamance)

gr_all <- ggplot(aes(x = year, y = spg_score), data=spg) +
  geom_jitter(position = position_jitter(width = .1)) + 
  theme_fivethirtyeight() + scale_colour_fivethirtyeight()

gr_alamance <-  ggplot(aes(x = year, y = spg_score), data=spg_alamance, colour=lea_name) +
  geom_jitter(position = position_jitter(width = .1)) + 
  theme_fivethirtyeight() + scale_colour_fivethirtyeight()
  
gr_wake <- ggplot(aes(x = year, y = spg_score), data=spg_wake) +
    geom_jitter(position = position_jitter(width = .1)) +
    theme_fivethirtyeight() + scale_colour_fivethirtyeight()

gr_edgecombe <- ggplot(aes(x = year, y = spg_score), data=spg_edgecombe) +
  geom_jitter(position = position_jitter(width = .1)) +
  theme_fivethirtyeight() + scale_colour_fivethirtyeight()

gr_washington <- ggplot(aes(x = year, y = spg_score), data=spg_washington) +
  geom_jitter(position = position_jitter(width = .1)) +
  theme_fivethirtyeight() + scale_colour_fivethirtyeight()

spg_yo <- spg %>%
  filter(lea_name.null())

gr_all + facet_grid(. ~ lea_name)


grid.arrange(gr_alamance, gr_wake, gr_edgecombe, gr_washington)
  
  
  ##ggsave("plot.svg")

  