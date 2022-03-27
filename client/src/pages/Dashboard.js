import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import TinderCard from 'react-tinder-card'
import ChatContainer from '../components/ChatContainer'

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [genderedUsers, setGenderedUsers] = useState(null)
  const [lastDirection, setLastDirection] = useState()
  const [cookies, setCookie, removeCookie] = useCookies(['user'])


  const userId = cookies.UserId

  const getUser = async () => {
    try {
      const response = await axios.get('http://localhost:8000/user', {
        params: { userId }
      })

      //once we have the response, we save it to state
      setUser(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  //Gets users gender interest and sends it through so the response will be the gendered users
  const getGenderedUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/gendered-users', {
        params: { gender: user?.gender_interest }
      })
      setGenderedUsers(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  // we make a get request to get the user from the BE, which then makes a call to the DB, and we save the response as 'user'.
  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    if (user) {
      getGenderedUsers()
    }
  }, [user])

  // console.log(genderedUsers)


  const updateMatches = async (matchedUserId) => {
    try {
      await axios.put('http://localhost:8000/addmatch', {
        userId,
        matchedUserId
      })
      getUser()
    } catch (error) {
      console.log(error)
    }
  }


  const swiped = (direction, swipedUserId) => {

    if (direction === 'right') {
      updateMatches(swipedUserId)
    }
    setLastDirection(direction)
  }

  const outOfFrame = (name) => {
    console.log(name + ' left the screen!') // logs who the user has gotten rid of. Removes from DB
  }

  //goes into User object, and if it exists we get the matched array (containing objects) and turn it into an array of user IDs
  //we add our own userID so that it doesn't show up
  const matchedUserIds = user?.matches.map(({ user_id }) => user_id).concat(userId)

  //if the genderedUser exists, filter them out.
  //if the gendered users do not exist (not included in the matched userIds), then return it
  const filteredGenderedUsers = genderedUsers?.filter(
    genderedUser => !matchedUserIds.includes(genderedUser.user_id)
  )



  return (
    <>
      {user &&
        <div className="dashboard">
          <ChatContainer user={user} />
          <div className="swipe-container">
            <div className='card-container'>

              {filteredGenderedUsers?.map((genderedUser) =>
                <TinderCard
                  className='swipe'
                  key={genderedUser.user_id}
                  onSwipe={(dir) => swiped(dir, genderedUser.user_id)} //logs direction. Goes into the 'swiped' function and changes the 'lastDirection' so that we know the direction at all times.
                  onCardLeftScreen={() => outOfFrame(genderedUser.first_name)}>
                  <div
                    style={{ backgroundImage: 'url(' + genderedUser.url + ')' }}
                    className='card'
                  >
                    <h3>{genderedUser.first_name}</h3>
                  </div>
                </TinderCard>
              )}

              <div className='swipe-info'>
                {lastDirection ? <p>You swiped {lastDirection}</p> : <p />}
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default Dashboard