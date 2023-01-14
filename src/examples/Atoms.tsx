import {atom, useRecoilState, useRecoilValue} from 'recoil'

const darkModeAtom = atom({
    key: 'darkMode',
    default: false,
})

const DarkModeSwitch = () => {
    const [darkMode, setDarkMode] = useRecoilState(darkModeAtom)

    console.log('darkMode', darkMode)

    return <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
}

const Button = () => {
    const darkMode = useRecoilValue(darkModeAtom)

    return (
        <button style={{backgroundColor: darkMode ? 'teal' : 'tomato', color: darkMode ? 'white' : 'black'}}>
            My UI Button
        </button>
    )
}

const Atoms = () => {
    return (
        <div>
            <div>
                <DarkModeSwitch />
            </div>
            <div>
                <Button />
            </div>
        </div>
    )
}

export default Atoms
