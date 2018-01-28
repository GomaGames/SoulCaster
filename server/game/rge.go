package game

type RGEInfo struct {
	Health int
	Money  int
}

var ResolutionCapped1 = RGEInfo{
	Money: 50,
}

var ResolutionCapped2 = RGEInfo{
	Health: 100,
}

var ResolutionCapped3 = RGEInfo{
	Health: 200,
	Money:  200,
}

var RGEs = map[int]RGEInfo{
	1: ResolutionCapped1,
	2: ResolutionCapped2,
	3: ResolutionCapped3,
}
