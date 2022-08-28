import {Add, Check, Close, Remove, Shuffle} from '@mui/icons-material';
import {Button, Card, createTheme, CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, ThemeProvider, Typography} from '@mui/material';
import {useCallback, useRef, useState} from 'react';
import './App.css';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function shuffleArray<T>(array: T[]) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function App() {
    const [players, _setPlayers] = useState<[string, boolean?][]>([]);
    const [open, setOpen] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const [choiceCount, setChoiceCount] = useState(0);
    const clearResults = useCallback(() => _setPlayers(players => players.map(
        ([playerName]) => [playerName, undefined]
    )), [_setPlayers]);
    const addPlayer = useCallback((player: string) => {
        _setPlayers(players => [...players, [player, undefined]]);
        clearResults();
    }, [_setPlayers, clearResults]);
    const removePlayer = useCallback((i: number) => {
        setChoiceCount(count => Math.min(count, players.length - 1));
        _setPlayers(players => players.slice(0, i).concat(players.slice(i + 1)));
        clearResults();
    }, [players, _setPlayers, clearResults]);
    const choosePlayers = useCallback(() => _setPlayers(
        players => {
            let chosen = Array(choiceCount).fill(true).concat(Array(players.length - choiceCount).fill(false));
            console.log(chosen);
            let out = players.slice();
            shuffleArray(chosen);
            for (let i = 0; i < chosen.length; i++) {
                out[i][1] = chosen[i];
            }
            return out;
        }
    ), [_setPlayers, choiceCount]);
    const ref = useRef<any>(null);
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Card style={{margin: '16px auto', maxWidth: '33%'}}>
                <List>
                    {players.map(([playerName, playerChosen], i) =>
                        <ListItemButton onClick={() => removePlayer(i)}>
                            <ListItemIcon>{
                                playerChosen === undefined
                                    ? <Remove />
                                    : playerChosen
                                        ? <Check />
                                        : <Close />
                            }</ListItemIcon>
                            <ListItemText>{playerName}</ListItemText>
                        </ListItemButton>
                    )}
                    <ListItemButton onClick={() => {
                        setOpen(true);
                        setPlayerName('');
                        if (ref.current) {
                            ref.current.focus();
                        }
                    }}>
                        <ListItemIcon><Add /></ListItemIcon>
                        <ListItemText>
                            Add player
                        </ListItemText>
                    </ListItemButton>
                    <ListItem>
                        <IconButton onClick={() => setChoiceCount(c => Math.max(c - 1, 0))}>
                            <Remove />
                        </IconButton>
                        <Typography style={{margin: '0 8px'}}>
                            Choose {choiceCount} players
                        </Typography>
                        <IconButton onClick={() => setChoiceCount(c => Math.min(c + 1, players.length))}>
                            <Add />
                        </IconButton>
                    </ListItem>
                    <ListItemButton onClick={choosePlayers}>
                        <ListItemIcon>
                            <Shuffle />
                        </ListItemIcon>
                        <ListItemText>
                            Shuffle!
                        </ListItemText>
                    </ListItemButton>
                </List>
            </Card>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent>
                    <DialogTitle>Enter the player's name</DialogTitle>
                    <TextField
                        ref={ref}
                        autoFocus
                        variant='filled'
                        fullWidth
                        label='Player name'
                        value={playerName}
                        onChange={e => setPlayerName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && playerName) {
                                addPlayer(playerName);
                                setOpen(false);
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpen(false);
                    }}>Cancel</Button>
                    <Button onClick={() => {
                        if (playerName) {
                            addPlayer(playerName);
                            setOpen(false);
                        }
                    }}>Add</Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}

export default App;
