import { React, Component } from 'react'
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

class Login extends Component  {

    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password:''
        }
    }

    render() {
        return (
            <div>
                {/* <label htmlFor='username'>Username</label>
                <input id='username' type='text' placeholder='Username'></input> */}
                    <Grid container 
                      direction="column"
                      alignItems="center"
                      justify="center"
                      style={{ minHeight: '100vh' }}
                    >
                        <Grid item xs={12}>
                            <TextField
                                    id="password1"
                                    label="Password"
                                    type="password"
                                    autoComplete="current-password"
                                />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                    id="password"
                                    label="Password"
                                    type="password"
                                    autoComplete="current-password"
                                />
                        </Grid>
                    </Grid>
                {/* <p>Hi {props.name}</p>
                {props.children} */}
            </div>
        );
    }

}

export default Login