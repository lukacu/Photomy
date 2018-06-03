// @flow
import React from 'react';
import ContentContainer from '../../common/ContentContainer';
import { Menu, Segment, Header, Container, Divider } from 'semantic-ui-react';
import {
  GENERAL_SETTINGS_MENU_ITEMS,
  MENU_UI_NAME_MAP,
  MENU_UI_NAME_ICON_MAP,
} from '../../../constants/settings';
import { Link } from 'react-router-dom';

type Props = { renderContent: Function, search: String };
type State = { activeItem: ?string };

class Settings extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    let menuItem = GENERAL_SETTINGS_MENU_ITEMS.find(
      menuItem => menuItem.to.search === props.search,
    );
    if (!menuItem) {
      menuItem = GENERAL_SETTINGS_MENU_ITEMS[0];
    }
    this.state = {
      activeItem: menuItem.name,
    };
  }

  handleMenuTabClick = (e: any, { name }: Object) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;
    const { renderContent } = this.props;
    const menuContent = MENU_UI_NAME_MAP.get(activeItem);
    const menuIcon = MENU_UI_NAME_ICON_MAP.get(activeItem);
    return (
      <ContentContainer className="Settings">
        <Divider style={{ marginTop: '0px', paddingTop: '0px' }} />
        <Container style={{ display: 'flex' }}>
          <Menu vertical style={{ marginBottom: '0px', minWidth: '50px' }}>
            <Menu.Item>
              <Menu.Header>General</Menu.Header>

              <Menu.Menu>
                {GENERAL_SETTINGS_MENU_ITEMS.map(menuItem => {
                  return (
                    <Menu.Item
                      as={Link}
                      to={menuItem.to}
                      key={menuItem.name}
                      name={menuItem.name}
                      content={menuItem.content}
                      onClick={this.handleMenuTabClick}
                      active={activeItem === menuItem.name}
                    />
                  );
                })}
              </Menu.Menu>
            </Menu.Item>

            <Menu.Item>
              <Menu.Header>Privacy</Menu.Header>
            </Menu.Item>

            <Menu.Item>
              <Menu.Header>Support</Menu.Header>
            </Menu.Item>
          </Menu>
          <Segment style={{ width: '100%', marginTop: '0px' }} className="SettingsContent">
            <Header as="h3" content={menuContent} icon={menuIcon} />
            {renderContent()}
          </Segment>
        </Container>
      </ContentContainer>
    );
  }
}

export default Settings;