import Phaser from 'phaser';

// All configuration
export default {
    type: Phaser.AUTO,
    parent: 'content',
    width: 240,
    height: 320,
    backgroundColor: '#000000',
    webFonts: ['DotGothic16', 'Amatic SC'],
    style: {
        default: {
            fontFamily: 'Amatic SC',
            fontSize: '18px',
            fill: '#FFFFFF'
        },
        start: {
            fontFamily: 'Amatic SC',
            fontSize: '30px',
            fill: '#FFFFFF'
        },
        logoText: {
            fontFamily: 'Amatic SC',
            fontSize: '60px',
            fill: '#45CC94'
        },
        text: {
            fontFamily: 'Amatic SC',
            fontSize: '22px',
            fill: '#FFFFFF'
        },
        textL: {
            fontFamily: 'Amatic SC',
            fontSize: '30px',
            fill: '#FFFFFF'
        }
    }
};

export const WIDTH = 15;
export const HEIGHT = 18;
export const LENGTH = 15;
