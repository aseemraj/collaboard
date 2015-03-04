# This code is a property of ASEEM RAJ BARANWAL and SACHIN GROVER
# Copyright (c) 2014


# importing pygame and math libraries
import pygame
from math import *

# Define some constants
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
PI = 3.141592653
LEFT = 1
RIGHT = 3
border = 90

strikerrad = 40
strikerMass = 2
gotiMass = 1
pocketrad = 30
gotirad = 26
gotispeedx = 0
gotispeedy = 0
friction = 0.2
fps = 70

# Set the width and height of the screen [width, height]
scrsize = (1200, 720)
wid = scrsize[1]

# Norm of the coordinate
mod = lambda v: sqrt(v[0] * v[0] + v[1] * v[1])

pygame.mixer.init()
collideSound = pygame.mixer.Sound("data/collide.ogg")
inPocketSound = pygame.mixer.Sound("data/gotoholes.ogg")

class Goti(pygame.sprite.Sprite):
    """
    This class represents the goti.
    It derives from the "Sprite" class in Pygame.
    """
    def __init__(self, color):
        """ Constructor. Pass in the color of the block,
        and its x and y position. """
 
        # Call the parent class (Sprite) constructor
        pygame.sprite.Sprite.__init__(self)
 
        self.image = pygame.Surface([gotirad, gotirad])
        self.image.fill(WOOD)
        self.image.set_colorkey(WOOD)
        if color==BLACK:
            self.isWhite = False
            self.isQueen = False
            for i in range(gotirad/2):
                pygame.draw.ellipse(self.image, (5*i, 5*i, 5*i), [i, i, gotirad-2*i, gotirad-2*i])

        elif color==WHITE:
            self.isWhite = True
            self.isQueen = False
            for i in range(gotirad/2):
                pygame.draw.ellipse(self.image, (255-5*i, 255-5*i, 255-5*i), [i, i, gotirad-2*i, gotirad-2*i])
        elif color==MAROON:
            self.isWhite = False
            self.isQueen = True
            for i in range(gotirad/2):
                pygame.draw.ellipse(self.image, (150-i, 5*i, 5*i), [i, i, gotirad-2*i, gotirad-2*i])
                pygame.draw.ellipse(self.image, MAROON, [0, 0, gotirad, gotirad], 2)        
        
        # Fetch the rectangle object that has the dimensions of the image
        # Update the position of this object by setting the values
        # of rect.x and rect.y
        self.rect = self.image.get_rect()
        self.rad = gotirad/2
        self.velx = gotispeedx
        self.vely = gotispeedy
        self.collided = False
        self.mass = gotiMass

    def update(self):
        """ Called each frame. """
        self.rect.x += self.velx
        self.rect.y += self.vely
        
        # If goti is too far down, reset to top of screen.
        if self.rect.y > wid-border/2-gotirad:
            self.rect.y = wid - border/2 - gotirad - 1
            self.vely = -1*abs(self.vely)
        elif self.rect.y<border/2:
            self.rect.y = border/2 + 1
            self.vely = abs(self.vely)
        if self.rect.x > wid-border/2-gotirad:
            self.rect.x = wid - border/2 - gotirad - 1
            self.velx = -1*abs(self.velx)
        elif self.rect.x<border/2:
            self.rect.x = border/2 + 1
            self.velx = abs(self.velx)
        if mod([self.velx, self.vely])==0:
            self.velx = 0
            self.vely = 0
        else:
            self.velx = self.velx - friction * self.velx / mod([self.velx, self.vely])  # friction acts in a direction
            self.vely = self.vely - friction * self.vely / mod([self.velx, self.vely])  # opposite to velocity
            if abs(self.velx)<friction:
                self.velx = 0
            if abs(self.vely)<friction:
                self.vely = 0

class Striker(Goti):
    """ The Striker class derives from Goti, but overrides some
    functionality with new a movement function that will move the Striker
    with the mouse. """
    def __init__(self):
        # Constructor function
        # Call the parent class (Sprite) constructor
        pygame.sprite.Sprite.__init__(self)
 
        # Create an image of the Striker, and fill it with a color.
        self.image = pygame.Surface([strikerrad, strikerrad])
        self.image.fill(WOOD)
        self.image.set_colorkey(WOOD)
        for i in range(strikerrad/2):
            pygame.draw.ellipse(self.image, (5*i, 5*i, 40+5*i), [i, i, strikerrad-2*i, strikerrad-2*i])

        pygame.draw.ellipse(self.image, BLACK, [0, 0, strikerrad, strikerrad], 2)
        
        self.velx = 0
        self.vely = 0
        self.rect = self.image.get_rect()
        self.rad = strikerrad/2
        self.collided = False
        self.state = 0
        self.player = 0
        self.transfer = 1
        self.mass = strikerMass

    def update(self):
        # User is still placing the striker
        if self.state==0:
            pos = pygame.mouse.get_pos()
            if self.player==0 or self.player==2:
                self.rect.x = pos[0]-strikerrad/2
                if self.player==0:
                    self.rect.y = wid-pocketrad-border-gotirad/2-strikerrad/2
                else:
                    self.rect.y = pocketrad+border+gotirad/2-strikerrad/2
                if pos[0]>wid-(strikerrad/2+pocketrad+border+gotirad):
                    self.rect.x = wid-(strikerrad+pocketrad+border+gotirad)
                elif pos[0]<pocketrad+border+gotirad+strikerrad/2:
                    self.rect.x = pocketrad+border+gotirad
            else:
                self.rect.y = pos[1]-strikerrad/2
                if self.player==1:
                    self.rect.x = wid-pocketrad-border-gotirad/2-strikerrad/2
                else:
                    self.rect.x = pocketrad+border+gotirad/2-strikerrad/2
                if pos[1]>wid-(strikerrad/2+pocketrad+border+gotirad):
                    self.rect.y = wid-(strikerrad+pocketrad+border+gotirad)
                elif pos[1]<pocketrad+border+gotirad+strikerrad/2:
                    self.rect.y = pocketrad+border+gotirad

        # User launched the striker
        elif self.state==2:
            self.rect.x += self.velx
            self.rect.y += self.vely
            if self.rect.y > wid-border/2-gotirad:
                self.rect.y = wid - border/2 - gotirad - 1
                self.vely = -1*abs(self.vely)
            elif self.rect.y<border/2:
                self.rect.y = border/2 + 1
                self.vely = abs(self.vely)
            if self.rect.x > wid-border/2-gotirad:
                self.rect.x = wid - border/2 - gotirad - 1
                self.velx = -1*abs(self.velx)
            elif self.rect.x<border/2:
                self.rect.x = border/2 + 1
                self.velx = abs(self.velx)
            if mod([self.velx, self.vely])==0:
                self.velx = 0
                self.vely = 0
            else:
                self.velx = self.velx - friction * self.velx / mod([self.velx, self.vely])  # friction acts in a direction
                self.vely = self.vely - friction * self.vely / mod([self.velx, self.vely])  # opposite to velocity
                if abs(self.velx)<friction:
                    self.velx = 0
                if abs(self.vely)<friction:
                    self.vely = 0


# When two entities collide, do what is to be done
def resolveCollision(obj1, obj2):
    c1 = [obj1.rect.x+obj1.rad, obj1.rect.y+obj1.rad]
    c2 = [obj2.rect.x+obj2.rad, obj2.rect.y+obj2.rad]
    distx = (c2[0]-c1[0])
    disty = (c1[1]-c2[1])
    dist = [(c2[0]-c1[0]), (c1[1]-c2[1])]
    if dist[1]==0:
        costheta = 1
        sintheta = 0
    elif dist[0]==0:
        costheta = 0
        sintheta = 1
    if mod(dist)>0:
        costheta = abs(distx)/mod(dist)
        sintheta = abs(disty)/mod(dist)
    if mod(dist)<obj1.rad + obj2.rad:
        diff = obj1.rad + obj2.rad - mod(dist)
        if obj2.rect.x>=obj1.rect.x:
            obj2.rect.x += ceil(diff*costheta)
        else:
            obj1.rect.x += ceil(diff*costheta)
        if obj2.rect.y>obj1.rect.y:
            obj2.rect.y += ceil(diff*costheta)
        else:
            obj1.rect.y += ceil(diff*costheta)

    rat1 = obj1.mass/(obj1.mass+obj2.mass)
    rat2 = obj2.mass/(obj1.mass+obj2.mass)
    v1x, v1y = obj1.velx, obj1.vely
    v2x, v2y = obj2.velx, obj2.vely
    obj1.velx = v1x*sintheta*sintheta + v2x*costheta*costheta + costheta*sintheta*(v2y-v1y)*rat2
    obj2.velx = v1x*costheta*costheta + v2x*sintheta*sintheta + costheta*sintheta*(v1y-v2y)*rat1
    obj1.vely = sintheta*costheta*(v1x-v2x) + v1y*costheta*costheta + v2y*sintheta*sintheta
    obj2.vely = sintheta*costheta*(v2x-v1x) + v1y*sintheta*sintheta + v2y*costheta*costheta
    for obj in [obj1, obj2]:
        if mod([obj.velx, obj.vely])==0:
            obj.velx = 0
            obj.vely = 0
        else:
            obj.velx = obj.velx - friction * obj.velx / mod([obj.velx, obj.vely])  # friction acts in a direction
            obj.vely = obj.vely - friction * obj.vely / mod([obj.velx, obj.vely])  # opposite to velocity
            if abs(obj.velx)<friction:
                obj.velx = 0
            if abs(obj.vely)<friction:
                obj.vely = 0
    
    # collision sound
    collideSound.play()


# Check if a goti or the striker is pocketed by the current player or not
def inPocket(obj):
    nearness = min(mod([obj.rect.x-2*border/3, obj.rect.y-2*border/3]),
                mod([obj.rect.x-2*border/3, obj.rect.y-wid+2*border/3]),
                mod([obj.rect.x-wid+2*border/3, obj.rect.y-2*border/3]),
                mod([obj.rect.x-wid+2*border/3, obj.rect.y-wid+2*border/3]))
    if nearness<pocketrad:
        if not hasattr(obj, 'transfer'):
            inPocketSound.play()
        obj.velx = 0
        obj.vely = 0
        return True
    return False

