import React, { Component } from 'react';
import {
	StyleSheet, View, Text, TouchableOpacity
} from 'react-native';
import { evaluate } from 'mathjs';

export default class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			prevCalc: "",
			resultText: "",
			resultValue: "",
			lastOperatorPos: []
		};
		this._onLongPress = this._onLongPress.bind(this);
		this._validate = this._validate.bind(this);
		this._onPress = this._onPress.bind(this);
		this.numbers = [[7, 8, 9], [4, 5, 6], [1, 2, 3], [".", 0, "DEL"]];
		this.operators = ["CLR", "+", "-", "*", "/", "="];
	}
	_onLongPress() {
		this.setState({
			prevCalc: "",
			resultText: "",
			resultValue: "",
			lastOperatorPos: []
		})
	}
	_validate() {
		let lastChar = this.state.resultText.slice(-1);
		if (this.operators.includes(lastChar)) {
			return false;
		}
		return true;
	}
	_onPress(e, id) {
		let calcText = this.state.resultText;
		let ops = this.operators;
		switch (id) {
			case "=":
				this._validate() && this._calc();
				break;
			case "CLR":
				this._onLongPress();
				break;
			case "DEL":
				if (lastChar !== "") {
					let lastChar = calcText.split('').pop();
					let lastOperatorPos = this.state.lastOperatorPos;
					if (this.operators.includes(lastChar)) {
						lastOperatorPos.pop()
					}
					this.setState({
						resultText: calcText.slice(0, -1),
						lastOperatorPos: lastOperatorPos
					})
				}
				break;
			case ".":
				let lastNumber;
				let opPos = this.state.lastOperatorPos;
				lastNumber = calcText.slice(opPos[opPos.length - 1], calcText.length - 1);
				if (lastNumber.split('').includes('.') || calcText.split('').pop() === ".") {
					return
				}
				this.setState({
					resultText: this.state.resultText + id.toString()
				})
				break;
			case "+":
			case "-":
			case "*":
			case "/":
				if (calcText.length === 0) {
					return;
				}
				let lastChar = calcText.split('').pop();
				if (ops.includes(lastChar)) {
					calcText = calcText.slice(0, -1)
				}
				let lastOp = this.state.lastOperatorPos;
				lastOp.push(calcText.length);
				this.setState({
					resultText: calcText + id.toString(),
					lastOperatorPos: lastOp
				})
				break;
			default:
				this.setState({
					resultText: this.state.resultText + id.toString()
				})
				break;
		}
	}
	_calc() {
		const txt = this.state.resultText;
		let result = Number(evaluate(txt).toPrecision(13)).toString();
		if(result === "Infinity" || result === "NaN"){
			result = "Divide by zero?"
		}
		this.setState(
			{
				prevCalc: txt,
				resultValue: result,
				resultText: result
			}
		)
	}
	render() {
		return (
			<>
				<View style={styles.container}>
					<View style={styles.userInput}>
						<Text style={styles.prevOperation}>{this.state.prevCalc}</Text>
						<Text style={styles.operation}>{this.state.resultText}</Text>
					</View>
					<View style={styles.resultContainer}>
						<Text style={styles.result}>{this.state.resultValue}</Text>
					</View>
					<View style={styles.buttons}>
						<View style={styles.numbers}>
							{this.numbers.map((numberRows, index) => (
								<View key={index} style={styles.row}>
									{numberRows.map((number, index) => (
										<TouchableOpacity key={index} onPress={e => this._onPress(e, number)}>
											<Text style={styles.text}>{number}</Text>
										</TouchableOpacity>
									))}
								</View>
							))}
						</View>
						<View style={styles.operations}>
							{
								this.operators.map((ops, index) => (
									<TouchableOpacity key={index} onPress={e => this._onPress(e, ops)}>
										<Text style={[styles.text, styles.opsbtn]}>{ops}</Text>
									</TouchableOpacity>
								))
							}
						</View>
					</View>
				</View>
			</>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	text: {
		margin: 5,
		textAlign: "center",
		textAlignVertical: "center",
		color: "white",
		fontSize: 30,
		height: 70,
		width: 70,
	},
	opsbtn: {
		marginTop: 10,
		marginLeft: 20,
		marginBottom: 10,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-around",
		textAlign: "center",
		paddingTop: 50,
		flex: 1
	},
	resultContainer: {
		flex: 1,
		backgroundColor: "red"
	},
	userInput: {
		flex: 2,
		backgroundColor: "#000000"
	},
	buttons: {
		flex: 6,
		flexDirection: 'row',
	},
	numbers: {
		flex: 3,
		backgroundColor: "#1D1D1D",
	},
	operations: {
		flex: 1,
		backgroundColor: "#484848",
		textAlign: "center",
	},
	prevOperation: {
		textAlign: "right",
		paddingTop: 10,
		paddingRight: 20,
		color: "white",
		fontSize: 30,
		flex: 1,
	},
	operation: {
		textAlign: "right",
		paddingTop: 10,
		paddingRight: 20,
		color: "white",
		fontSize: 30,
		flex: 1,
	},
	result: {
		textAlign: "right",
		paddingTop: 10,
		paddingRight: 20,
		color: "white",
		fontSize: 60,
		flex: 1,
	}
});