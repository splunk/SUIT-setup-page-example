import React, { Component } from 'react';
import Button from '@splunk/react-ui/Button';
import Heading from '@splunk/react-ui/Heading';
import List from '@splunk/react-ui/List';
import Link from '@splunk/react-ui/Link';
import Text from '@splunk/react-ui/Text';
import ColumnLayout from '@splunk/react-ui/ColumnLayout';
import { defaultFetchInit, handleResponse, handleError } from '@splunk/splunk-utils/fetch';

async function updateConf() {
    const fetchInit = defaultFetchInit;
    fetchInit.method = 'POST';
    const n = await fetch(
        'http://localhost:8001/en-US/splunkd/__raw/servicesNS/nobody/system/apps/local/setup-example-app',

        {
            ...fetchInit,
            body: 'configured=true',
        }
    );

    return n;
}

/* Function to create a Password */
async function createPassword(password) {
    const fetchInit = defaultFetchInit;
    fetchInit.method = 'POST';
    const realm = 'testRealm7';
    const user = 'user1';

    const n = await fetch(
        'http://localhost:8001/en-US/splunkd/__raw/servicesNS/nobody/setup-example-app/storage/passwords',
        {
            ...fetchInit,
            body: `name=${user}&password=${password}&realm=${realm}`,
        }
    ).then((response) => {
        return response;
    });

    return n;
}

class SetupComponent extends Component {
    constructor(props) {
        super(props);

        // Initialize State
        this.state = { passwordSet: false, isConfigured: false };

        // Bind Functions
        this.passwordClick = this.passwordClick.bind(this);
    }

    passwordClick(event) {
        // Prevent the form from going anywhere
        event.preventDefault();

        createPassword(event.target.value).then((response) => {
            if (response.status >= 200 && response.status <= 299) {
                this.setState({ passwordSet: true });
                console.log(this.state.passwordSet);
            }
        });
        updateConf().then((response) => {
            if (response.status >= 200 && response.status <= 299) {
                this.setState({ isConfigured: true });
                console.log(this.state.isConfigured);
            }
        });

        window.location.href = 'http://localhost:8001/en-US/app/setup-example-app/search';
    }

    render() {
        return (
            <>
                <div>
                    {!this.state.passwordSet ? (
                        <div>
                            <Heading level={1}>Welcome to Your Setup Page!</Heading>
                            <ColumnLayout divider="vertical">
                                <ColumnLayout.Row>
                                    <ColumnLayout.Column span={6}>
                                        <div className="left">
                                            <Heading level={2}>Overview</Heading>
                                            In many cases, a Splunk app requires additional
                                            configuration so that it can perform the functionality
                                            it was designed for. This can include: saving
                                            user-provided configuratiions in .conf files,
                                            integrating with external services through REST API and
                                            checking for app dependencies.
                                            <br />
                                            <br />
                                            This setup page is a small example of the many different
                                            use cases, and it will create/modify two files in the
                                            local directory of this Splunk App.
                                            <br />
                                            Splunk App Directory Path:
                                            $SPLUNK_HOME/etc/apps/developer_guidance_setup_view/local/
                                            <List>
                                                <List.Item>
                                                    <Link to="https://docs.splunk.com/Documentation/Splunk/latest/Admin/Appconf">
                                                        app.conf
                                                    </Link>
                                                    <List style={{ margin: 0 }}>
                                                        <List.Item>
                                                            Sets the [install] stanza
                                                            `is_configured` property to `true`
                                                        </List.Item>
                                                    </List>
                                                </List.Item>
                                                <List.Item>
                                                    <Link to="https://docs.splunk.com/Documentation/Splunk/latest/Admin/Passwords">
                                                        passwords.conf
                                                    </Link>
                                                    <List style={{ margin: 0 }}>
                                                        <List.Item>
                                                            Creates and encrypts the API key,
                                                            resulting in a new passwords.conf
                                                            stanza.
                                                        </List.Item>
                                                    </List>
                                                </List.Item>
                                            </List>
                                            In some cases, you can even introduce custom setup
                                            options and parameters, which would require an
                                            additional file. For example, if you wanted the user to
                                            specify an API Key.
                                            <List>
                                                <List.Item>
                                                    setup_view_example.conf
                                                    <List style={{ margin: 0 }}>
                                                        <List.Item>
                                                            Creates a custom conf file to manage
                                                            Splunk App specific settings
                                                        </List.Item>
                                                        <List.Item>
                                                            Creates the stanza [example_stanza]
                                                        </List.Item>
                                                        <List.Item>
                                                            Creates the property `api_url` in the
                                                            [example_stanza] and assigns the `API
                                                            URL` to it
                                                        </List.Item>
                                                    </List>
                                                </List.Item>
                                            </List>
                                            <Heading level={2}>Setup Properties</Heading>
                                            <div className="field api_key">
                                                <div className="title">
                                                    <Heading level={3}>Password:</Heading>
                                                    Please specify the password that will be used to
                                                    setup this app.
                                                </div>
                                                <Text
                                                    inline
                                                    type="password"
                                                    value={this.state.value}
                                                />{' '}
                                            </div>
                                            <Heading level={2}>Complete the Setup</Heading>
                                            <div>
                                                Please press the `Perform Setup` button below to
                                                complete the Splunk App setup.
                                            </div>
                                            <br />
                                            <div>
                                                <Button
                                                    type="submit"
                                                    label="Perform Setup"
                                                    name="setup_button"
                                                    onClick={this.passwordClick}
                                                />
                                            </div>
                                            <div>
                                                <Button
                                                    type="submit"
                                                    label="Check passwords"
                                                    name="check_button"
                                                    onClick={this.getPasswords}
                                                />
                                            </div>
                                            <br />
                                            <div className="error output" />
                                        </div>
                                    </ColumnLayout.Column>
                                    <ColumnLayout.Column span={6}>
                                        <div className="right">
                                            <Heading level={2}>Implementation Overview</Heading>
                                            Splunk Setup pages can be made with various Splunk
                                            provided developer tools. This app utilizes the new
                                            Splunk UI Toolkit, allowing for consistent visual
                                            components and responsive app interaction with ReactJS
                                            packages.
                                            <br />
                                            <Heading level={2}>Packages</Heading>
                                            <List>
                                                <List.Item>
                                                    <Link to="https://splunkui.splunk.com/Create/ComponentTutorial">
                                                        @splunk/create
                                                    </Link>
                                                    <List style={{ margin: 0 }}>
                                                        <List.Item>
                                                            Generates the entire Splunk App,
                                                            allowing for easy creation of a cloud
                                                            ready Splunk App with ReactJS
                                                        </List.Item>
                                                    </List>
                                                </List.Item>
                                                <List.Item>
                                                    <Link to="https://splunkui.splunk.com/Packages/react-ui">
                                                        @splunk/react-ui
                                                    </Link>
                                                    <List style={{ margin: 0 }}>
                                                        <List.Item>
                                                            Visual component library to easily put
                                                            together consistent and responsive user
                                                            interfaces. Used in the password entry,
                                                            buttons and page layout of the app
                                                        </List.Item>
                                                    </List>
                                                </List.Item>
                                                <List.Item>
                                                    <Link to="https://splunkui.splunk.com/Packages/splunk-utils">
                                                        @splunk/splunk-utils
                                                    </Link>
                                                    <List style={{ margin: 0 }}>
                                                        <List.Item>
                                                            Allows for interaction with Splunk REST
                                                            API endpoints. Used to update specified
                                                            conf files and generate helper functions
                                                            for the workflow of the setup page
                                                        </List.Item>
                                                    </List>
                                                </List.Item>
                                            </List>
                                            <Heading level={2}>More Information</Heading>
                                            <List>
                                                <List.Item>
                                                    <Link to="https://splunkui.splunk.com">
                                                        Splunk UI Documentation
                                                    </Link>
                                                </List.Item>
                                                <List.Item>
                                                    <Link to="https://dev.splunk.com">
                                                        Splunk Platform Developer Documentation
                                                    </Link>
                                                </List.Item>
                                            </List>
                                        </div>
                                    </ColumnLayout.Column>
                                </ColumnLayout.Row>
                            </ColumnLayout>
                        </div>
                    ) : (
                        <Heading level={3}>Successfully Added Password</Heading>
                    )}
                </div>
            </>
        );
    }
}

export default SetupComponent;
