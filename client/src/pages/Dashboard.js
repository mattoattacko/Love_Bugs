import { useState } from 'react'
import TinderCard from 'react-tinder-card'

import ChatContainer from '../components/ChatContainer'

const Dashboard = () => {

  const characters = [
    {
      name: 'Richard Dawkins',
      url: 'https://imgur.com/Q9WPlWA.jpg'
    },
    {
      name: 'Kristin Bachman',
      url: 'https://imgur.com/OckVkRo.jpg'
    },
    {
      name: 'Monica Hall',
      url: 'https://imgur.com/wDmRJPc.jpg'
    },
    {
      name: 'Jared Dunn',
      url: 'https://imgur.com/MWAcQRM.jpg'
    },
    {
      name: 'Dinesh Chugtai',
      url: 'https://imgur.com/dmwjVjG.jpg'
    }
  ]

  const [lastDirection, setLastDirection] = useState()

  const swiped = (direction, nameToDelete) => {
    console.log('removing: ' + nameToDelete)
    setLastDirection(direction)
  }

  const outOfFrame = (name) => {
    console.log(name + ' left the screen!') // logs who the user has gotten rid of. Removes from DB
  }

  return (
    <div className="dashboard">
      <ChatContainer />
      <div className="swipe-container">
        <div className='card-container'>
        
          {characters.map((character) =>
            <TinderCard 
              className='swipe' 
              key={character.name} 
              onSwipe={(dir) => swiped(dir, character.name)} //logs direction. Goes into the 'swiped' function and changes the 'lastDirection' so that we know the direction at all times.
              onCardLeftScreen={() => outOfFrame(character.name)}>
                <div 
                  style={{ backgroundImage: 'url(' + character.url + ')' }} 
                  className='card'
                >
                  <h3>{character.name}</h3>
                </div>
            </TinderCard>
          )}

        <div className='swipe-info'>
          {lastDirection ? <p>You swiped {lastDirection}</p> : <p/>}
        </div>


        </div>
      </div>
    </div>
  )
}

export default Dashboard