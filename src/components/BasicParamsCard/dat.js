export default `
OPTIONS      MN       SDUC   2 1   DC  C    PTPTPTPTPTPTPTPT
SECT
SECT M01       TUB                               620.006.900
SECT M02       CON                               620.006.700581.10
SECT M03       CON                               581.106.400550.00
SECT M04       TUB                               550.006.400
SECT M05       TUB                               550.006.800
SECT M06       TUB                               550.007.300
GRUP
GRUP M01 M01                  20.607.92331.50 1    1.001.00     0.500F 7.850
GRUP M02 M02                  20.607.92331.50 1    1.001.00     0.500F 7.850
GRUP M03 M03                  20.607.92331.50 1    1.001.00     0.500F 7.850
GRUP M04 M04                  20.607.92331.50 1    1.001.00     0.500N 7.850
GRUP M05 M05                  20.607.92331.50 1    1.001.00     0.500N 7.850
GRUP M06 M06                  20.607.92331.50 1    1.001.00     0.500N 7.850
MEMBER
MEMBER 20011201 M01
MEMBER 12011202 M02
MEMBER 12021203 M03
MEMBER 12031204 M04
MEMBER 12041205 M05
MEMBER 12054001 M06
JOINT
JOINT 2001      0.     0.   -14.                0.000 PILEHD
JOINT 1201      0.     0.    -9.                0.000 222000
JOINT 1202      0.     0.    -4.                0.000 222000
JOINT 1203      0.     0.     0.                0.000 222000
JOINT 1204      0.     0.     6.                0.000 222000
JOINT 1205      0.     0.     9.                0.000 222000
JOINT 4001      0.     0.    12.                0.000 222000
LOAD
END
 **JNCV** 0 0 0 0 0 0 1
END
`
