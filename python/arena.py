# This code is a property of ASEEM RAJ BARANWAL and SACHIN GROVER
# Copyright (c) 2014


# importing modules and definitions
import pygame, random
from pygame.locals import *
from math import *

# Initialize GUI
pygame.init()

# Globals

# Color palette
BLACK    = (   0,   0,   0)
LBROWN   = (  80,  30,   0)
DBROWN   = (  50,  20,   0)
DGRAY    = (  30,  30,  30)
WHITE    = ( 255, 255, 255)
WOOD     = ( 220, 200, 150)
BLUE     = (   0,   0, 255)
GREEN    = (   0, 255,   0)
RED      = ( 255,   0,   0)
PINK     = ( 255,   0, 255)
MAROON   = ( 150,   0,   0)
PI       = 3.141592653
LEFT     = 1
RIGHT    = 3
SCRSZ    = (1200, 600)

brush    = 2

clock = pygame.time.Clock()

font = pygame.font.Font(None, 34)
text = ''

screen = pygame.display.set_mode(SCRSZ)
pygame.display.set_caption("Arena")

# Fill background
background = pygame.Surface(screen.get_size())
background = background.convert()
background.fill(WHITE)


# Blit everything to the screen
screen.blit(background, (0, 0))
COL = BLACK

running = True
# pygame.draw.rect(screen, WOOD, [50, 50, 50, 50])

state = 0
inpos = []

# The main event loop
while running:
    for event in pygame.event.get(): # User did something
        if event.type == pygame.QUIT: # If user clicked close
            running = False

        elif event.type == pygame.MOUSEBUTTONDOWN and event.button == LEFT:
            inpos = pygame.mouse.get_pos()
            state = 1

        elif event.type == pygame.MOUSEBUTTONUP:
            state = 0

        if event.type == pygame.KEYDOWN:
            keys = pygame.key.get_pressed()
            if keys[pygame.K_LCTRL] and keys[pygame.K_EQUALS]:
                brush += 1
            elif keys[pygame.K_LCTRL] and keys[pygame.K_MINUS]:
                brush -= 1
                if brush < 2:
                    brush = 2

    if state!=0:
        pos = pygame.mouse.get_pos()
        pygame.draw.circle(screen, COL, pos, brush/2-1)
        pygame.draw.line(screen, COL, (pos[0], pos[1]), (inpos[0], inpos[1]), brush)
        inpos = pos

    pygame.display.flip()
    # Limit to input frames per second
    # clock.tick(fps)

pygame.quit()
