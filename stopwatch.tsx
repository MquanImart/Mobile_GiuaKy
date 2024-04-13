
import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
    ScrollView,
    StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type SectionProps = PropsWithChildren<{
    index: number;
    time: string;
    min: boolean;
    max: boolean;
  }>;

  
  const Step = React.memo(({ index, time, min, max }: SectionProps): React.JSX.Element => {
    return (
      <View style={styles.lap_box}>
        <Text style={[styles.text_lap_box, min ? { color: 'green' } : max ? { color: 'red' } : {}]}>
          Vòng {index}
        </Text>
        <Text style={[styles.text_lap_box, min ? { color: 'green' } : max ? { color: 'red' } : {}]}>
          {time}
        </Text>
      </View>
    );
  });
  

function stopwatch(): React.JSX.Element {
    const [isStart, setIsStart] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [timer, setTimer] = useState(0);
    const [timerlap, setTimerlap] = useState(0);
    const [laps, setLaps] = useState([]);

    const [lapmin, setLapMin] = useState(0);
    const [indexlapmin, setIndexMin] = useState(0);
    const [lapmax, setLapMax] = useState(0);
    const [indexlapmax, setIndexMax] = useState(0);

    useEffect(() => {
        let interval: string | number | NodeJS.Timeout | undefined;
        if (isRunning) {
          interval = setInterval(() => {
            setTimer((timer) => (timer + 1));
          }, 10);
        }
        return () => clearInterval(interval);
      }, [isRunning]);
    
      const handleStartStop = () => {
        if (!isStart){setIsStart(true)};
        setIsRunning(!isRunning);
      };
      const handleLapReset = () => {
        if (isRunning){
            lapTimer();
        } else {
            handleReset();
        }
      }
      const lapTimer = () => {
        const newLap = {
            name: (laps.length + 1),
            time: String(Math.floor((timer - timerlap) / 6000)).padStart(2, '0') + ':' 
            + String(Math.floor(((timer - timerlap) / 100) % 60)).padStart(2, '0') + ',' 
            + String((timer - timerlap) % 100).padStart(2, '0'),
          };
          if (timer - timerlap > lapmax){setLapMax(timer-timerlap); setIndexMax(laps.length + 1)};
          if (timer - timerlap < lapmin){setLapMin(timer-timerlap); setIndexMin(laps.length + 1)}
          else if (lapmin == 0){setLapMin(timer-timerlap); setIndexMin(laps.length + 1)};
          setTimerlap(timer);
          setLaps([...laps, newLap]);
      };
      const handleReset = () => {
        setIsRunning(false);
        setTimer(0);
        setTimerlap(0);
        setLaps([]);
        setIsStart(false);

        setLapMax(0);
        setLapMin(0);
        setIndexMin(0);
        setIndexMax(0);
      };
    return (
        <View style={styles.container}>
            <View style={[styles.item, styles.item_clock]}>
                <Text style={[styles.text_clock, styles.clock]}>
                    {String(Math.floor(timer / 6000)).padStart(2, '0')}:
                    {String(Math.floor(timer / 100)).padStart(2, '0')},
                    {String((timer%100)).padStart(2, '0')}
                </Text>
            </View>
            <View style={[styles.item, styles.item_boxbutton]}>
                <View style={styles.box_button}>
                    <TouchableOpacity style={styles.button} 
                    onPress={handleLapReset}>
                        <Text style={[styles.button_text, {color: 'white'}]}>{isRunning ? 'Vòng':'Đặt lại'} </Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.box_button, isRunning?{borderColor: 'rgba(255, 0, 0, 0.3)'}:{borderColor: 'rgba(59, 239, 44, 0.3)'}]}>
                    <TouchableOpacity style={[styles.button, isRunning?{backgroundColor: 'rgba(255, 0, 0, 0.3)'}:{backgroundColor: 'rgba(59, 239, 44, 0.3)'}]}
                    onPress={handleStartStop}>
                        <Text style={[styles.button_text, isRunning?{color: '#FF4A4A'}:{color: '#4AFF4A'}]}>{isRunning ? 'Dừng':'Bắt Đầu'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView style={[styles.item, styles.item_lap]}>
                {isStart && <Step key={laps.length} index={laps.length + 1} min={false} max = {false}
                    time={`${String(Math.floor((timer - timerlap) / 6000)).padStart(2, '0')}:${String(Math.floor((timer - timerlap) / 100)).padStart(2, '0')},${String((timer - timerlap) % 100).padStart(2, '0')}`} />}
                {laps.map((lap, index) => (
                <Step key={index} index={lap.name} time={lap.time} min={(index + 1)==indexlapmin &&laps.length>1?true:false} max={(index + 1)==indexlapmax &&laps.length>1?true:false}></Step>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    item: {
        width: '90%',
        alignSelf: 'center'
    },
    item_boxbutton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderBottomWidth: 0.2,
        paddingBottom: 10,
        borderBottomColor: 'white'
    },
    text_clock: {
        color: 'white',
        fontWeight: '200',
        fontSize: 20,
    },
    button_text: {
        fontWeight: '300',
        fontSize: 20,
    },
    item_clock: {
        flex: 2,
        justifyContent: 'flex-end',
    },
    clock: {
        fontSize: 100,
    },
    box_button: {
        width: 85,
        height: 85,
        borderRadius: 50,
        borderColor: '#333333',
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: 80,
        height: 80,
        borderRadius: 50,
        backgroundColor: '#333333',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 1,
    },
    item_lap: {
        height: 300,
    },
    lap_box: {
        //#092910
        width: '100%',
        alignSelf: 'center',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        alignItems: 'center',
        borderBottomWidth: 0.5,
        paddingBottom: 10,
        borderBottomColor: 'white',
    },
    text_lap_box: {
        color: 'white',
        fontSize: 20,
        fontWeight: '400',
    }
});

export default stopwatch;
