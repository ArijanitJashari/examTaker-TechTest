import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles, withStyles } from '@material-ui/styles';
import Avatar from '@material-ui/core/Avatar';
import { createMuiTheme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import api from '../../api/api';

import {
  Grid,
  Button,
  TextField,
  Link,
  Typography
} from '@material-ui/core';

const CssTextField = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        marginTop: -4
      }
    },
  },
})(TextField);

const theme = createMuiTheme({
  palette: {
    primary: { main: '#A11E29'},
    secondary: { main: '#757575'},
  }
});
const schema = {
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    // email: true,
    length: {
      maximum: 64
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  }
};

const useStyles = makeStyles(() => ({
  label: {
    textTransform: 'none',
    textAlign: 'center',
    fontWeight: 500,
    // fontStyle: "italic"
  },
  rootButton: {
    backgroundColor: theme.palette.secondary.main,
  },
  avatar: {
    // margin: theme.spacing(1),
    width: 120,
    height: 120,
    // backgroundColor: theme.palette.primary.main,
  },
  paper: {
    // marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  root: {
    // backgroundColor: theme.palette.background.default,
    backgroundColor: 'white',
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/auth.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  bio: {
    color: theme.palette.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    // [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    // }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  signUpButton: {
    margin: theme.spacing(2, 0)
  },
  rootProgress: {
    display: 'flex',
    justifyContent: 'center',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));


const Login = props => {
  const { history } = props;

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });
  const [errorVisible, setErrorVisible] = useState(false)
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  // const handleBack = () => {
  //   history.goBack();
  // };
  function  loginClick(event) {
    event.preventDefault();

    setLoading(true)
    
    api.login(formState.values.email, formState.values.password,
      function(data) {
        console.log('login api called ', data)
        if (data.code == 501) {
          setError(data.message)
          setErrorVisible(true)
          setLoading(false)
        }
        else {
          // try {
          //   api.setStoredCredentials(data)
          // }
          // catch(e) { console.log(e) }
          // loadContent().then(results=> console.log('done', results))
          foo().then(results=> console.log('done', results));
        }
      }
    )
  };

  async function loadContent() {
    console.log('load Content')
    // try {
    //   setLoading(true);
      // const response = await loadTermsContent() && loadFaqContent() && loadUserExamSession()

      // const json = await response;
      // console.log('await ', response);

      return await Promise.all([loadTermsContent(), loadFaqContent(), loadUserExamSession()].map(handleRejection));
      // setResult(
      //   json.items.map(item => {
      //     console.log(item.volumeInfo.title);
      //     return item.volumeInfo.title;
      //   })
      // );
    // } catch (error) {
    //   console.log('e ', error)
    // }
  }
  async function bar() {
    await new Promise(() => api.getExamPolicy().then(responseJson => {
      console.log('loadTermsContent: ', responseJson)
      api.setStoredTermsContent(responseJson)
    }))
      .then((r)=> console.log('bar', r))
      .catch((e)=> { console.log('bar errored'); throw e; });
  }
  async function bam() {
    await new Promise(() => api.getExamFaq().then(responseJson => {
      console.log('loadFaqContent: ', responseJson)
      api.setStoredFaqs(responseJson)
    }))
  }
  async function bat() {
      await new Promise(r=> setTimeout(r, 3000))
        .then(()=> console.log('bat'))
        .then(()=> 'bat result');
  }

  function handleRejection(p) {
      return p.catch(err=> ({ error: err }));
  }

  async function foo(arr) {
    console.log('foo');
    return await Promise.all([bar(), bam(), bat()].map(handleRejection));
  }

  function proceedToLogin() {
    setLoading(true)
    setTimeout(function() { history.push("/") }, 3000 ) 
}
async function setCredentials(data) {
  await new Promise(api.setCredentials(data))
  .then(responseJson => {
    console.log('loadSetCredentials')
  })
}

  async function loadTermsContent() {
    await new Promise(api.getExamPolicy())
    .then(responseJson => {
      console.log('loadTermsContent: ', responseJson)
      api.setStoredTermsContent(responseJson)
    })
  }

  async function loadFaqContent() {
    await new Promise(await api.getExamFaq())
      .then(responseJson => {
        console.log('loadFaqContent: ', responseJson)
        api.setStoredFaqs(responseJson)
    })
  }

  async function loadUserExamSession() {
    await new Promise(api.getUserExamSession(1, 10, 
      function(data) {
        console.log('loadexamSessionContent', data)
        api.setStoredUserExamSessions(data)
        // proceedToLogin();
    }))
  }
  function handleRejection(p) {
    return p.catch(err=> ({ error: err }));
  }

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <div className={classes.root}>

      <Grid
        className={classes.grid}
        container
        alignItems="center"
        justify="center"
      >
        <Grid
          className={classes.content}
          item
          lg={7}
          xs={12}
        >
          <div className={classes.content}>
            <div className={classes.contentBody}>
              <form
                className={classes.form}
                onSubmit={loginClick}
              >
                <div className={classes.paper}>
                {loading === true ? (
                    <div className={classes.rootProgress}>
                      <CircularProgress color="primary" />
                    </div>
                    ) : (
                      <Avatar src="/images/logos/logo.png" alt="logo" className={classes.avatar} />
                    )
                  }

                <Typography
                  className={classes.title}
                  color="textSecondary"
                  variant="subtitle1"
                  // gutterBottom
                >
                   Welcome! Please login using your PECB account
                </Typography>
                </div>
                <CssTextField
                  className={classes.textField}
                  error={hasError('email')}
                  fullWidth
                  helperText={
                    hasError('email') ? formState.errors.email[0] : null
                  }
                  label="ID / Email"
                  name="email"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.email || ''}
                  variant="outlined"
                />
                <CssTextField
                  className={classes.textField}
                  error={hasError('password')}
                  fullWidth
                  helperText={
                    hasError('password') ? formState.errors.password[0] : null
                  }
                  label="Password"
                  name="password"
                  onChange={handleChange}
                  type="password"
                  value={formState.values.password || ''}
                  variant="outlined"
                />
                {errorVisible == true && (                  
                  <Typography
                    color="primary"
                    variant="caption"
                  >
                    {error}
                  </Typography>
                )}
              <Grid container justify="center" spacing={2}>
              <Grid item xs={12} sm={12} md={6}>
                <Button
                  className={classes.signUpButton}
                  color="primary"
                  disabled={!formState.isValid}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  classes={{
                    label: classes.label,
                    root: classes.rootButton
                  }}
                  onClick={() => {

                  }
                }
                >
                  Login   
                </Button>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <Button
                    className={classes.signUpButton}
                    color="default"
                    fullWidth
                    size="large"
                    variant="outlined"
                    classes={{
                      label: classes.label
                  }}
                  >
                   Close application
                </Button>
              </Grid>
              </Grid>
                <Link
                  component={RouterLink}
                  to="/sign-in"
                  variant="body1"
                  color="textSecondary"
                >
                  Forgot password?
                </Link>
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

Login.propTypes = {
  history: PropTypes.object
};

export default withRouter(Login);
