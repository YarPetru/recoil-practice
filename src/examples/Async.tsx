import {Container, Heading, Text} from '@chakra-ui/layout'
import {Select} from '@chakra-ui/select'
import {divide} from 'lodash'
import {Suspense, useState} from 'react'
import {atom, selector, useRecoilState, useRecoilValue, selectorFamily, atomFamily, useSetRecoilState} from 'recoil'
import {getWeather} from './fakeAPI'

// const userIdState = atom<number | undefined>({
//     key: 'userId',
//     default: undefined,
// })

// ---------selector case
// const userState = selector({
//   key: 'user',
//   get: async ({get}) => {
//       const userId = get(userIdState)
//       if (userId === undefined) return

//       const userData = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`).then((res) => res.json())
//       return userData
//   },
// })

// ---------selectorFamily case
const userState = selectorFamily({
    key: 'user',
    get: (userId: number) => async () => {
        const userData = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`).then((res) => res.json())
        return userData
    },
})

const weatherRequestIdState = atomFamily({
    key: 'weatherRequestId',
    default: 0,
})

const useRefetchWeather = (userId: number) => {
    const setRequestId = useSetRecoilState(weatherRequestIdState(userId))
    return () => setRequestId((id) => id + 1)
}

const weatherState = selectorFamily({
    key: 'weather',
    get:
        (userId: number) =>
        async ({get}) => {
            get(weatherRequestIdState(userId))

            const user = get(userState(userId))
            const weather = await getWeather(user.address.city)

            return weather
        },
})

const UserWeather = ({userId}: {userId: number}) => {
    const user = useRecoilValue(userState(userId))
    const weather = useRecoilValue(weatherState(userId))
    const refetch = useRefetchWeather(userId)

    return (
        <>
            <Text>
                <b>Weather for {user.address.city}: </b> {weather}°C
            </Text>
            <button onClick={refetch}>(Refresh weather)</button>
        </>
    )
}

const UserData = ({userId}: {userId: number}) => {
    // ---------selector case
    // const user = useRecoilValue(userState)
    // if (!user) return null

    // ---------selectorFamily case
    const user = useRecoilValue(userState(userId))

    return (
        <div>
            <Heading as="h2" size="md" mb={1}>
                User data:
            </Heading>
            <Text>
                <b>Name: </b> {user.name}
            </Text>
            <Text>
                <b>Phone: </b> {user.phone}
            </Text>
            <Suspense fallback={<div>Loading...</div>}>
                <UserWeather userId={userId} />
            </Suspense>
        </div>
    )
}

export const Async = () => {
    // ---------selector case
    // const [userId, setUserId] = useRecoilState(userIdState)

    // ---------selectorFamily case
    const [userId, setUserId] = useState<undefined | number>(undefined)

    return (
        <Container py={10}>
            <Heading as="h1" mb={4}>
                View Profile
            </Heading>
            <Heading as="h2" size="md" mb={1}>
                Choose a user:
            </Heading>
            <Select
                placeholder="Choose a user"
                mb={4}
                value={userId}
                onChange={(event) => {
                    const value = event.target.value
                    setUserId(value ? parseInt(value) : undefined)
                }}
            >
                <option value="1">User 1</option>
                <option value="2">User 2</option>
                <option value="3">User 3</option>
            </Select>
            {userId !== undefined && (
                <Suspense fallback={<div>Loading...</div>}>
                    <UserData userId={userId} />
                </Suspense>
            )}
        </Container>
    )
}
