// Code generated by protoc-gen-gogo. DO NOT EDIT.
// source: teleport/legacy/types/wrappers/wrappers.proto

package wrappers

import (
	fmt "fmt"
	_ "github.com/gogo/protobuf/gogoproto"
	proto "github.com/gogo/protobuf/proto"
	io "io"
	math "math"
	math_bits "math/bits"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.GoGoProtoPackageIsVersion3 // please upgrade the proto package

// StringValues is a list of strings.
type StringValues struct {
	Values               []string `protobuf:"bytes,1,rep,name=Values,proto3" json:"Values,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *StringValues) Reset()         { *m = StringValues{} }
func (m *StringValues) String() string { return proto.CompactTextString(m) }
func (*StringValues) ProtoMessage()    {}
func (*StringValues) Descriptor() ([]byte, []int) {
	return fileDescriptor_3c19e1bba76a2eab, []int{0}
}
func (m *StringValues) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *StringValues) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_StringValues.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *StringValues) XXX_Merge(src proto.Message) {
	xxx_messageInfo_StringValues.Merge(m, src)
}
func (m *StringValues) XXX_Size() int {
	return m.Size()
}
func (m *StringValues) XXX_DiscardUnknown() {
	xxx_messageInfo_StringValues.DiscardUnknown(m)
}

var xxx_messageInfo_StringValues proto.InternalMessageInfo

// LabelValues is a list of key value pairs, where key is a string
// and value is a list of string values.
type LabelValues struct {
	// Values contains key value pairs.
	Values               map[string]StringValues `protobuf:"bytes,1,rep,name=Values,proto3" json:"labels" protobuf_key:"bytes,1,opt,name=key,proto3" protobuf_val:"bytes,2,opt,name=value,proto3"`
	XXX_NoUnkeyedLiteral struct{}                `json:"-"`
	XXX_unrecognized     []byte                  `json:"-"`
	XXX_sizecache        int32                   `json:"-"`
}

func (m *LabelValues) Reset()         { *m = LabelValues{} }
func (m *LabelValues) String() string { return proto.CompactTextString(m) }
func (*LabelValues) ProtoMessage()    {}
func (*LabelValues) Descriptor() ([]byte, []int) {
	return fileDescriptor_3c19e1bba76a2eab, []int{1}
}
func (m *LabelValues) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *LabelValues) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_LabelValues.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *LabelValues) XXX_Merge(src proto.Message) {
	xxx_messageInfo_LabelValues.Merge(m, src)
}
func (m *LabelValues) XXX_Size() int {
	return m.Size()
}
func (m *LabelValues) XXX_DiscardUnknown() {
	xxx_messageInfo_LabelValues.DiscardUnknown(m)
}

var xxx_messageInfo_LabelValues proto.InternalMessageInfo

// CustomType is a json protobuf representation of a Go struct. This is
// useful when defining customtypes for use with the (gogoproto.customtype) extension.
type CustomType struct {
	// Bytes is the marshalled json data of a struct.
	Bytes                []byte   `protobuf:"bytes,1,opt,name=Bytes,proto3" json:"json"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *CustomType) Reset()         { *m = CustomType{} }
func (m *CustomType) String() string { return proto.CompactTextString(m) }
func (*CustomType) ProtoMessage()    {}
func (*CustomType) Descriptor() ([]byte, []int) {
	return fileDescriptor_3c19e1bba76a2eab, []int{2}
}
func (m *CustomType) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *CustomType) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_CustomType.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *CustomType) XXX_Merge(src proto.Message) {
	xxx_messageInfo_CustomType.Merge(m, src)
}
func (m *CustomType) XXX_Size() int {
	return m.Size()
}
func (m *CustomType) XXX_DiscardUnknown() {
	xxx_messageInfo_CustomType.DiscardUnknown(m)
}

var xxx_messageInfo_CustomType proto.InternalMessageInfo

func init() {
	proto.RegisterType((*StringValues)(nil), "wrappers.StringValues")
	proto.RegisterType((*LabelValues)(nil), "wrappers.LabelValues")
	proto.RegisterMapType((map[string]StringValues)(nil), "wrappers.LabelValues.ValuesEntry")
	proto.RegisterType((*CustomType)(nil), "wrappers.CustomType")
}

func init() {
	proto.RegisterFile("teleport/legacy/types/wrappers/wrappers.proto", fileDescriptor_3c19e1bba76a2eab)
}

var fileDescriptor_3c19e1bba76a2eab = []byte{
	// 304 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x5c, 0x90, 0x4f, 0x4b, 0xc3, 0x30,
	0x18, 0x87, 0x97, 0xcd, 0x8d, 0x2d, 0x1d, 0x22, 0x45, 0xc6, 0xd8, 0xa1, 0xab, 0x3d, 0x48, 0x0f,
	0xb3, 0x81, 0xe9, 0x41, 0x3c, 0x56, 0x14, 0x04, 0x2f, 0x56, 0xf1, 0xe0, 0x2d, 0x1d, 0x21, 0x56,
	0xb3, 0x26, 0xa4, 0xe9, 0x24, 0x9f, 0xc9, 0x2f, 0xd2, 0xa3, 0x9f, 0xa0, 0x68, 0x8f, 0xfb, 0x14,
	0xd2, 0x76, 0x7f, 0xaa, 0xa7, 0x3c, 0xef, 0x9b, 0x87, 0xf7, 0x7d, 0xf9, 0xc1, 0x33, 0x45, 0x18,
	0x11, 0x5c, 0x2a, 0xc4, 0x08, 0xc5, 0x0b, 0x8d, 0x94, 0x16, 0x24, 0x41, 0x1f, 0x12, 0x0b, 0x41,
	0xe4, 0x1e, 0x3c, 0x21, 0xb9, 0xe2, 0x66, 0x7f, 0x5b, 0x4f, 0x8e, 0x29, 0xa7, 0xbc, 0x6a, 0xa2,
	0x92, 0xea, 0x7f, 0xe7, 0x14, 0x0e, 0x1f, 0x95, 0x8c, 0x62, 0xfa, 0x8c, 0x59, 0x4a, 0x12, 0x73,
	0x04, 0x7b, 0x35, 0x8d, 0x81, 0xdd, 0x71, 0x07, 0xc1, 0xa6, 0x72, 0x3e, 0x01, 0x34, 0xee, 0x71,
	0x48, 0xd8, 0xc6, 0xbb, 0xfb, 0xe3, 0x19, 0xf3, 0x13, 0x6f, 0xb7, 0xb8, 0xa1, 0x79, 0xf5, 0x73,
	0x13, 0x2b, 0xa9, 0xfd, 0xc3, 0x2c, 0x9f, 0xb6, 0xd6, 0xf9, 0xb4, 0xc7, 0x4a, 0x21, 0xd9, 0x8e,
	0x9e, 0x3c, 0x40, 0xa3, 0xa1, 0x99, 0x47, 0xb0, 0xf3, 0x4e, 0xf4, 0x18, 0xd8, 0xc0, 0x1d, 0x04,
	0x25, 0x9a, 0x33, 0xd8, 0x5d, 0x95, 0xc2, 0xb8, 0x6d, 0x03, 0xd7, 0x98, 0x8f, 0xf6, 0xab, 0x9a,
	0xa7, 0x07, 0xb5, 0x74, 0xd5, 0xbe, 0x04, 0xce, 0x0c, 0xc2, 0xeb, 0x34, 0x51, 0x7c, 0xf9, 0xa4,
	0x05, 0x31, 0x2d, 0xd8, 0xf5, 0xb5, 0xaa, 0x4e, 0x05, 0xee, 0xd0, 0xef, 0xaf, 0xf3, 0xe9, 0xc1,
	0x5b, 0xc2, 0xe3, 0xa0, 0x6e, 0xfb, 0xb7, 0xd9, 0x8f, 0xd5, 0xca, 0x0a, 0x0b, 0x7c, 0x15, 0x16,
	0xf8, 0x2e, 0x2c, 0xf0, 0x72, 0x41, 0x23, 0xf5, 0x9a, 0x86, 0xde, 0x82, 0x2f, 0x11, 0x95, 0x78,
	0x15, 0x29, 0xac, 0x22, 0x1e, 0x63, 0x86, 0x76, 0xe9, 0x63, 0x11, 0xfd, 0x8b, 0x3e, 0xec, 0x55,
	0x91, 0x9e, 0xff, 0x06, 0x00, 0x00, 0xff, 0xff, 0xe1, 0xab, 0xc5, 0xab, 0xa3, 0x01, 0x00, 0x00,
}

func (m *StringValues) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *StringValues) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *StringValues) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	if m.XXX_unrecognized != nil {
		i -= len(m.XXX_unrecognized)
		copy(dAtA[i:], m.XXX_unrecognized)
	}
	if len(m.Values) > 0 {
		for iNdEx := len(m.Values) - 1; iNdEx >= 0; iNdEx-- {
			i -= len(m.Values[iNdEx])
			copy(dAtA[i:], m.Values[iNdEx])
			i = encodeVarintWrappers(dAtA, i, uint64(len(m.Values[iNdEx])))
			i--
			dAtA[i] = 0xa
		}
	}
	return len(dAtA) - i, nil
}

func (m *LabelValues) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *LabelValues) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *LabelValues) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	if m.XXX_unrecognized != nil {
		i -= len(m.XXX_unrecognized)
		copy(dAtA[i:], m.XXX_unrecognized)
	}
	if len(m.Values) > 0 {
		for k := range m.Values {
			v := m.Values[k]
			baseI := i
			{
				size, err := (&v).MarshalToSizedBuffer(dAtA[:i])
				if err != nil {
					return 0, err
				}
				i -= size
				i = encodeVarintWrappers(dAtA, i, uint64(size))
			}
			i--
			dAtA[i] = 0x12
			i -= len(k)
			copy(dAtA[i:], k)
			i = encodeVarintWrappers(dAtA, i, uint64(len(k)))
			i--
			dAtA[i] = 0xa
			i = encodeVarintWrappers(dAtA, i, uint64(baseI-i))
			i--
			dAtA[i] = 0xa
		}
	}
	return len(dAtA) - i, nil
}

func (m *CustomType) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *CustomType) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *CustomType) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	if m.XXX_unrecognized != nil {
		i -= len(m.XXX_unrecognized)
		copy(dAtA[i:], m.XXX_unrecognized)
	}
	if len(m.Bytes) > 0 {
		i -= len(m.Bytes)
		copy(dAtA[i:], m.Bytes)
		i = encodeVarintWrappers(dAtA, i, uint64(len(m.Bytes)))
		i--
		dAtA[i] = 0xa
	}
	return len(dAtA) - i, nil
}

func encodeVarintWrappers(dAtA []byte, offset int, v uint64) int {
	offset -= sovWrappers(v)
	base := offset
	for v >= 1<<7 {
		dAtA[offset] = uint8(v&0x7f | 0x80)
		v >>= 7
		offset++
	}
	dAtA[offset] = uint8(v)
	return base
}
func (m *StringValues) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	if len(m.Values) > 0 {
		for _, s := range m.Values {
			l = len(s)
			n += 1 + l + sovWrappers(uint64(l))
		}
	}
	if m.XXX_unrecognized != nil {
		n += len(m.XXX_unrecognized)
	}
	return n
}

func (m *LabelValues) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	if len(m.Values) > 0 {
		for k, v := range m.Values {
			_ = k
			_ = v
			l = v.Size()
			mapEntrySize := 1 + len(k) + sovWrappers(uint64(len(k))) + 1 + l + sovWrappers(uint64(l))
			n += mapEntrySize + 1 + sovWrappers(uint64(mapEntrySize))
		}
	}
	if m.XXX_unrecognized != nil {
		n += len(m.XXX_unrecognized)
	}
	return n
}

func (m *CustomType) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	l = len(m.Bytes)
	if l > 0 {
		n += 1 + l + sovWrappers(uint64(l))
	}
	if m.XXX_unrecognized != nil {
		n += len(m.XXX_unrecognized)
	}
	return n
}

func sovWrappers(x uint64) (n int) {
	return (math_bits.Len64(x|1) + 6) / 7
}
func sozWrappers(x uint64) (n int) {
	return sovWrappers(uint64((x << 1) ^ uint64((int64(x) >> 63))))
}
func (m *StringValues) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowWrappers
			}
			if iNdEx >= l {
				return io.ErrUnexpectedEOF
			}
			b := dAtA[iNdEx]
			iNdEx++
			wire |= uint64(b&0x7F) << shift
			if b < 0x80 {
				break
			}
		}
		fieldNum := int32(wire >> 3)
		wireType := int(wire & 0x7)
		if wireType == 4 {
			return fmt.Errorf("proto: StringValues: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: StringValues: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		case 1:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Values", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowWrappers
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthWrappers
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthWrappers
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.Values = append(m.Values, string(dAtA[iNdEx:postIndex]))
			iNdEx = postIndex
		default:
			iNdEx = preIndex
			skippy, err := skipWrappers(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthWrappers
			}
			if (iNdEx + skippy) > l {
				return io.ErrUnexpectedEOF
			}
			m.XXX_unrecognized = append(m.XXX_unrecognized, dAtA[iNdEx:iNdEx+skippy]...)
			iNdEx += skippy
		}
	}

	if iNdEx > l {
		return io.ErrUnexpectedEOF
	}
	return nil
}
func (m *LabelValues) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowWrappers
			}
			if iNdEx >= l {
				return io.ErrUnexpectedEOF
			}
			b := dAtA[iNdEx]
			iNdEx++
			wire |= uint64(b&0x7F) << shift
			if b < 0x80 {
				break
			}
		}
		fieldNum := int32(wire >> 3)
		wireType := int(wire & 0x7)
		if wireType == 4 {
			return fmt.Errorf("proto: LabelValues: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: LabelValues: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		case 1:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Values", wireType)
			}
			var msglen int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowWrappers
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				msglen |= int(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			if msglen < 0 {
				return ErrInvalidLengthWrappers
			}
			postIndex := iNdEx + msglen
			if postIndex < 0 {
				return ErrInvalidLengthWrappers
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			if m.Values == nil {
				m.Values = make(map[string]StringValues)
			}
			var mapkey string
			mapvalue := &StringValues{}
			for iNdEx < postIndex {
				entryPreIndex := iNdEx
				var wire uint64
				for shift := uint(0); ; shift += 7 {
					if shift >= 64 {
						return ErrIntOverflowWrappers
					}
					if iNdEx >= l {
						return io.ErrUnexpectedEOF
					}
					b := dAtA[iNdEx]
					iNdEx++
					wire |= uint64(b&0x7F) << shift
					if b < 0x80 {
						break
					}
				}
				fieldNum := int32(wire >> 3)
				if fieldNum == 1 {
					var stringLenmapkey uint64
					for shift := uint(0); ; shift += 7 {
						if shift >= 64 {
							return ErrIntOverflowWrappers
						}
						if iNdEx >= l {
							return io.ErrUnexpectedEOF
						}
						b := dAtA[iNdEx]
						iNdEx++
						stringLenmapkey |= uint64(b&0x7F) << shift
						if b < 0x80 {
							break
						}
					}
					intStringLenmapkey := int(stringLenmapkey)
					if intStringLenmapkey < 0 {
						return ErrInvalidLengthWrappers
					}
					postStringIndexmapkey := iNdEx + intStringLenmapkey
					if postStringIndexmapkey < 0 {
						return ErrInvalidLengthWrappers
					}
					if postStringIndexmapkey > l {
						return io.ErrUnexpectedEOF
					}
					mapkey = string(dAtA[iNdEx:postStringIndexmapkey])
					iNdEx = postStringIndexmapkey
				} else if fieldNum == 2 {
					var mapmsglen int
					for shift := uint(0); ; shift += 7 {
						if shift >= 64 {
							return ErrIntOverflowWrappers
						}
						if iNdEx >= l {
							return io.ErrUnexpectedEOF
						}
						b := dAtA[iNdEx]
						iNdEx++
						mapmsglen |= int(b&0x7F) << shift
						if b < 0x80 {
							break
						}
					}
					if mapmsglen < 0 {
						return ErrInvalidLengthWrappers
					}
					postmsgIndex := iNdEx + mapmsglen
					if postmsgIndex < 0 {
						return ErrInvalidLengthWrappers
					}
					if postmsgIndex > l {
						return io.ErrUnexpectedEOF
					}
					mapvalue = &StringValues{}
					if err := mapvalue.Unmarshal(dAtA[iNdEx:postmsgIndex]); err != nil {
						return err
					}
					iNdEx = postmsgIndex
				} else {
					iNdEx = entryPreIndex
					skippy, err := skipWrappers(dAtA[iNdEx:])
					if err != nil {
						return err
					}
					if (skippy < 0) || (iNdEx+skippy) < 0 {
						return ErrInvalidLengthWrappers
					}
					if (iNdEx + skippy) > postIndex {
						return io.ErrUnexpectedEOF
					}
					iNdEx += skippy
				}
			}
			m.Values[mapkey] = *mapvalue
			iNdEx = postIndex
		default:
			iNdEx = preIndex
			skippy, err := skipWrappers(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthWrappers
			}
			if (iNdEx + skippy) > l {
				return io.ErrUnexpectedEOF
			}
			m.XXX_unrecognized = append(m.XXX_unrecognized, dAtA[iNdEx:iNdEx+skippy]...)
			iNdEx += skippy
		}
	}

	if iNdEx > l {
		return io.ErrUnexpectedEOF
	}
	return nil
}
func (m *CustomType) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowWrappers
			}
			if iNdEx >= l {
				return io.ErrUnexpectedEOF
			}
			b := dAtA[iNdEx]
			iNdEx++
			wire |= uint64(b&0x7F) << shift
			if b < 0x80 {
				break
			}
		}
		fieldNum := int32(wire >> 3)
		wireType := int(wire & 0x7)
		if wireType == 4 {
			return fmt.Errorf("proto: CustomType: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: CustomType: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		case 1:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Bytes", wireType)
			}
			var byteLen int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowWrappers
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				byteLen |= int(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			if byteLen < 0 {
				return ErrInvalidLengthWrappers
			}
			postIndex := iNdEx + byteLen
			if postIndex < 0 {
				return ErrInvalidLengthWrappers
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.Bytes = append(m.Bytes[:0], dAtA[iNdEx:postIndex]...)
			if m.Bytes == nil {
				m.Bytes = []byte{}
			}
			iNdEx = postIndex
		default:
			iNdEx = preIndex
			skippy, err := skipWrappers(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthWrappers
			}
			if (iNdEx + skippy) > l {
				return io.ErrUnexpectedEOF
			}
			m.XXX_unrecognized = append(m.XXX_unrecognized, dAtA[iNdEx:iNdEx+skippy]...)
			iNdEx += skippy
		}
	}

	if iNdEx > l {
		return io.ErrUnexpectedEOF
	}
	return nil
}
func skipWrappers(dAtA []byte) (n int, err error) {
	l := len(dAtA)
	iNdEx := 0
	depth := 0
	for iNdEx < l {
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return 0, ErrIntOverflowWrappers
			}
			if iNdEx >= l {
				return 0, io.ErrUnexpectedEOF
			}
			b := dAtA[iNdEx]
			iNdEx++
			wire |= (uint64(b) & 0x7F) << shift
			if b < 0x80 {
				break
			}
		}
		wireType := int(wire & 0x7)
		switch wireType {
		case 0:
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return 0, ErrIntOverflowWrappers
				}
				if iNdEx >= l {
					return 0, io.ErrUnexpectedEOF
				}
				iNdEx++
				if dAtA[iNdEx-1] < 0x80 {
					break
				}
			}
		case 1:
			iNdEx += 8
		case 2:
			var length int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return 0, ErrIntOverflowWrappers
				}
				if iNdEx >= l {
					return 0, io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				length |= (int(b) & 0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			if length < 0 {
				return 0, ErrInvalidLengthWrappers
			}
			iNdEx += length
		case 3:
			depth++
		case 4:
			if depth == 0 {
				return 0, ErrUnexpectedEndOfGroupWrappers
			}
			depth--
		case 5:
			iNdEx += 4
		default:
			return 0, fmt.Errorf("proto: illegal wireType %d", wireType)
		}
		if iNdEx < 0 {
			return 0, ErrInvalidLengthWrappers
		}
		if depth == 0 {
			return iNdEx, nil
		}
	}
	return 0, io.ErrUnexpectedEOF
}

var (
	ErrInvalidLengthWrappers        = fmt.Errorf("proto: negative length found during unmarshaling")
	ErrIntOverflowWrappers          = fmt.Errorf("proto: integer overflow")
	ErrUnexpectedEndOfGroupWrappers = fmt.Errorf("proto: unexpected end of group")
)