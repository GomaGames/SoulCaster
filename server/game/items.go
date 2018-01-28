package game

type Item struct {
	Name             string
	Cost             int
	AdditionalPower  int
	AdditionalIncome int
}

var Staff = Item{
	Name:             "Staff",
	Cost:             0,
	AdditionalPower:  0,
	AdditionalIncome: 0,
}

var Stick = Item{
	Name:             "Stick",
	Cost:             100,
	AdditionalPower:  2,
	AdditionalIncome: 5,
}

var Shield = Item{
	Name:             "Shield",
	Cost:             300,
	AdditionalPower:  4,
	AdditionalIncome: 0,
}

var Scepter = Item{
	Name:             "Scepter",
	Cost:             2500,
	AdditionalPower:  8,
	AdditionalIncome: 10,
}

var BroomStick = Item{
	Name:             "BroomStick",
	Cost:             200,
	AdditionalPower:  2,
	AdditionalIncome: 10,
}

var BalloonAnimal = Item{
	Name:             "Balloon Animal",
	Cost:             450,
	AdditionalPower:  0,
	AdditionalIncome: 25,
}

var Pillow = Item{
	Name:             "Pillow",
	Cost:             3000,
	AdditionalPower:  0,
	AdditionalIncome: 35,
}

var Items = map[int]Item{
	1: Staff,
	2: Stick,
	3: Shield,
	4: Scepter,
	5: BroomStick,
	6: BalloonAnimal,
	7: Pillow,
}
